package com.booknest.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public boolean sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@booknest.com");
            message.setTo(toEmail);
            message.setSubject("BookNest Password Reset OTP");
            message.setText(buildOtpEmailBody(otp));

            mailSender.send(message);
            logger.info("OTP email sent successfully to: {}", toEmail);
            return true;
        } catch (MailException e) {
            logger.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            return false;
        }
    }

    private String buildOtpEmailBody(String otp) {
        return """
                Hello,
                
                You have requested to reset your password for your BookNest account.
                
                Your One-Time Password (OTP) is: %s
                
                This OTP will expire in 10 minutes.
                
                If you did not request this password reset, please ignore this email or contact support.
                
                Best regards,
                BookNest Team
                """.formatted(otp);
    }
}
