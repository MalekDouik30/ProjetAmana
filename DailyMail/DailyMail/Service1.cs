using System;

using System.ServiceProcess;
using System.IO;
using System.Threading;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net.Mail;

namespace DailyMail
{
    public partial class Service1 : ServiceBase
    {
       /* Thread th;
        bool isRunning = false;*/
        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            this.WriteToFile("Simple Service started {0}");
            this.ScheduleService();
            /*th = new Thread(Dothis);
            th.Start();
            isRunning = true;*/
        }
        /*protected  void Dothis()
        {
            while (isRunning)
            {
                File.AppendAllText(@"C:\Tasks\DailyMail.txt", Environment.NewLine + "" + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss"));
            }
        }*/

        protected override void OnStop()
        {
            /*isRunning = false;
            th = null;*/

            this.WriteToFile("Simple Service stopped {0}");
            this.Schedular.Dispose();
        }
        private Timer Schedular;
        public void ScheduleService()
        {
            try
            {
                Schedular = new Timer(new TimerCallback(SchedularCallback));
                string mode = ConfigurationManager.AppSettings["Mode"].ToUpper();
                this.WriteToFile("Simple Service Mode: " + mode + " {0}");

                //Set the Default Time.
                DateTime scheduledTime = DateTime.MinValue;

                if (mode == "DAILY")
                {
                    //Get the Scheduled Time from AppSettings.
                    scheduledTime = DateTime.Parse(System.Configuration.ConfigurationManager.AppSettings["ScheduledTime"]);
                    if (DateTime.Now > scheduledTime)
                    {
                        //If Scheduled Time is passed set Schedule for the next day.
                        scheduledTime = scheduledTime.AddDays(1);
                    }
                }

                if (mode.ToUpper() == "INTERVAL")
                {
                    //Get the Interval in Minutes from AppSettings.
                    int intervalMinutes = Convert.ToInt32(ConfigurationManager.AppSettings["IntervalMinutes"]);

                    //Set the Scheduled Time by adding the Interval to Current Time.
                    scheduledTime = DateTime.Now.AddMinutes(intervalMinutes);
                    if (DateTime.Now > scheduledTime)
                    {
                        //If Scheduled Time is passed set Schedule for the next Interval.
                        scheduledTime = scheduledTime.AddMinutes(intervalMinutes);
                    }
                }

                TimeSpan timeSpan = scheduledTime.Subtract(DateTime.Now);
                string schedule = string.Format("{0} day(s) {1} hour(s) {2} minute(s) {3} seconds(s)", timeSpan.Days, timeSpan.Hours, timeSpan.Minutes, timeSpan.Seconds);

                this.WriteToFile("Simple Service scheduled to run after: " + schedule + " {0}");

                //Get the difference in Minutes between the Scheduled and Current Time.
                int dueTime = Convert.ToInt32(timeSpan.TotalMilliseconds);

                //Change the Timer's Due Time.
                Schedular.Change(dueTime, Timeout.Infinite);
            }
            catch (Exception ex)
            {
                WriteToFile("Simple Service Error on: {0} " + ex.Message + ex.StackTrace);

                //Stop the Windows Service.
                using (System.ServiceProcess.ServiceController serviceController = new System.ServiceProcess.ServiceController("SimpleService"))
                {
                    serviceController.Stop();
                }
            }
        }

        private void SchedularCallback(object e)
        {
            try
            {
                DataTable dt = new DataTable();
                DataTable dt2 = new DataTable();
                string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;

                /* Malek */
                DataTable dt3 = new DataTable();
              
                using (SqlConnection con = new SqlConnection(constr))
                {
                    using (SqlCommand cmd1 = new SqlCommand("select * FROM parametres_globaux"))
                    {
                        cmd1.Connection = con;
                        using (SqlDataAdapter sda = new SqlDataAdapter(cmd1))
                        {
                            sda.Fill(dt3);
                        }
                    }
                }
                string nbeJour = "";
                foreach (DataRow row in dt3.Rows)
                {
                     nbeJour = row["par_nbrJours"].ToString();
                }

                /* END Malek */


                //string nbrjours = "select par_nbrJours from parametres_globaux";
                //string frommail = "select par_email_from FROM parametres_globaux";
                string mail = "select par_email_from,par_email_to FROM parametres_globaux";

                string query = "  SELECT P.pla_montant_depot,P.pla_organisme_societe ,convert(varchar(10), convert(datetime,P.pla_date_echeance,120),101) as  pla_date_echeance, O.org_libelle FROM Placement P inner JOIN organisme O ON P.pla_organisme_societe = O.org_id where DATEDIFF(DAY, CURRENT_TIMESTAMP, P.pla_date_echeance) = " + nbeJour;

                

                string password = ConfigurationManager.AppSettings["Password"];

                using (SqlConnection con = new SqlConnection(constr))
                {

                    using (SqlCommand cmd2 = new SqlCommand(mail))
                    {
                        cmd2.Connection = con;
                        using (SqlDataAdapter sda1 = new SqlDataAdapter(cmd2))
                        {
                            sda1.Fill(dt2);
                        }
                    }
                    using (SqlCommand cmd1 = new SqlCommand(query))
                    {
                        cmd1.Connection = con;
                        using (SqlDataAdapter sda = new SqlDataAdapter(cmd1))
                        {
                            sda.Fill(dt);
                        }
                    }
                    

                }
                
                foreach (DataRow row in dt.Rows)
                {
                    foreach (DataRow row2 in dt2.Rows)
                    {
                        
                            string montant = row["pla_montant_depot"].ToString();
                            string organisme = row["org_libelle"].ToString();
                            string dateE = row["pla_date_echeance"].ToString();
                            string mailsender = row2["par_email_from"].ToString();
                            string mailrecipient = row2["par_email_to"].ToString();

                        WriteToFile("MALEK : Nbe jours :" + nbeJour);
                        WriteToFile("Trying to send email to: " + montant + " " + organisme +" "+ mailsender +" " + mailrecipient);

                            using (MailMessage mm = new MailMessage(mailsender,mailrecipient))
                            {
                                mm.Subject = "Alerte Expiration Placement";
                                mm.Body = string.Format("Bonjour,<br /><br />Le dépôt de placement: <b>{0} DT</b> auprès de l'institution financiére <b>{1}</b> sera expiré dans les " + nbeJour+ " prochains jours le {2}.<br /> Veuillez prendre les dispositions nécessaires.<br /><br />Cordialement,", montant, organisme, dateE);

                                mm.IsBodyHtml = true;
                                SmtpClient smtp = new SmtpClient();
                                smtp.Host = "smtp.office365.com";
                                smtp.EnableSsl = true;
                                System.Net.NetworkCredential credentials = new System.Net.NetworkCredential();
                                credentials.UserName = mailsender;
                                credentials.Password = password;
                                smtp.UseDefaultCredentials = true;
                                smtp.Credentials = credentials;
                                smtp.Port = 587;
                                smtp.Send(mm);
                                WriteToFile("Email sent successfully to: " + montant + " " + organisme);
                            }
                        
                    }
                }
                this.ScheduleService();
            }
            catch (Exception ex)
            {
                WriteToFile("Simple Service Error on: {0} " + ex.Message + ex.StackTrace);

                //Stop the Windows Service.
                using (System.ServiceProcess.ServiceController serviceController = new System.ServiceProcess.ServiceController("SimpleService"))
                {
                    serviceController.Stop();
                }
            }
        }

        private void WriteToFile(string text)
        {
            string path = @"C:\Tasks\ServiceLog.txt"; 
            using (StreamWriter writer = new StreamWriter(path, true))
            {
                writer.WriteLine(string.Format(text, DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt")));
                writer.Close();
            }
        }

    }
}
