// Email template helpers for PostGrid

export const emailTemplates = {
  welcome: (userName: string, appName = 'LAXMI') => ({
    subject: `Welcome to ${appName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ${appName}!</h1>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${userName},</p>
            <p style="font-size: 16px;">Thank you for joining ${appName}! We're excited to have you on board.</p>
            <p style="font-size: 16px;">Get started by exploring your dashboard and setting up your preferences.</p>
            <a href="{{dashboardUrl}}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go to Dashboard</a>
          </div>
        </body>
      </html>
    `,
  }),

  notification: (title: string, message: string, ctaText?: string, ctaUrl?: string) => ({
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${title}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">${title}</h2>
            <p style="font-size: 16px; color: #666;">${message}</p>
            ${ctaText && ctaUrl ? `
              <a href="${ctaUrl}" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">${ctaText}</a>
            ` : ''}
          </div>
        </body>
      </html>
    `,
  }),

  reminder: (eventName: string, eventTime: string, eventDescription?: string) => ({
    subject: `Reminder: ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Event Reminder</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 5px;">
            <h2 style="color: #856404; margin: 0 0 10px 0;">Reminder</h2>
            <h3 style="color: #333; margin: 0 0 10px 0;">${eventName}</h3>
            <p style="color: #666; margin: 0 0 10px 0;"><strong>When:</strong> ${eventTime}</p>
            ${eventDescription ? `<p style="color: #666; margin: 0;">${eventDescription}</p>` : ''}
          </div>
        </body>
      </html>
    `,
  }),
}
