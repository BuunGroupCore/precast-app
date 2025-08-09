import React from "react";

interface SendGridIconProps {
  className?: string;
}

export const SendGridIcon: React.FC<SendGridIconProps> = ({ className }) => (
  <img src="/icons/sendgrid.svg" alt="SendGrid" className={className || ""} />
);
