import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CalendarInviteRequest {
  to: string;
  eventTitle: string;
  eventDescription?: string;
  eventLocation?: string;
  startTime: string;
  endTime?: string;
  icsContent: string;
  fanName?: string;
  eventUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      eventTitle,
      eventDescription,
      eventLocation,
      startTime,
      endTime,
      icsContent,
      fanName,
      eventUrl,
    }: CalendarInviteRequest = await req.json();

    console.log("Sending calendar invite to:", to);

    // Format the date for display
    const eventDate = new Date(startTime);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = eventDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });

    // Create HTML email with event details
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .event-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .event-details p {
              margin: 10px 0;
            }
            .event-details strong {
              color: #667eea;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 10px 5px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📅 You're Invited!</h1>
          </div>
          <div class="content">
            ${fanName ? `<p>Hi ${fanName},</p>` : "<p>Hi there,</p>"}
            <p>You've successfully RSVP'd to this event. Here are the details:</p>
            
            <div class="event-details">
              <p><strong>Event:</strong> ${eventTitle}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              ${eventLocation ? `<p><strong>Location:</strong> ${eventLocation}</p>` : ""}
              ${eventDescription ? `<p><strong>Details:</strong> ${eventDescription}</p>` : ""}
            </div>

            <p>The calendar invite is attached to this email. You can also add it directly to your calendar:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              ${eventUrl ? `<a href="${eventUrl}" class="button">View Event Details</a>` : ""}
            </div>

            <p>We look forward to seeing you there! 🎉</p>

            <div class="footer">
              <p>LiveStatz - Making live events more engaging</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Convert ics content to base64 for attachment
    const icsBase64 = btoa(icsContent);

    const emailResponse = await resend.emails.send({
      from: "LiveStatz Events <events@resend.dev>",
      to: [to],
      subject: `Calendar Invite: ${eventTitle}`,
      html: htmlContent,
      attachments: [
        {
          filename: "event.ics",
          content: icsBase64,
          content_type: "text/calendar",
        },
      ],
    });

    console.log("Calendar invite sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending calendar invite:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send calendar invite",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
