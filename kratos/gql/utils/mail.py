from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_templated_mail(subject, sender, recipients, template, context=None):
    return send_mail(
        subject,
        "",
        sender,
        recipients,
        html_message=render_to_string(template, context),
    )


def event_url_from_id(event_id):
    return "https://buildevents.today/build/{}".format(event_id)


def send_verification(recipient, url):
    return send_templated_mail(
        "Verify you email for BuildEvents",
        "noreply@buildevents.today",
        [recipient],
        "verify_email.html",
        {"verify_email_url": url}
    )


def send_event_pending_notification(recipient, event):
    return send_templated_mail(
        "Your event is in review",
        "noreply@buildevents.today",
        [recipient],
        "event_pending.html",
        {
            "event_url": event_url_from_id(event.id),
            "user_name": event.owner.name,
            "event_type": event.type.name,
            "attendees": event.attendees,
            "duration": event.duration,
        }
    )


def send_event_quoted_notification(recipient, event):
    return send_templated_mail(
        "Your event quotation is ready!",
        "noreply@buildevents.today",
        [recipient],
        "event_quoted.html",
        {
            "event_url": event_url_from_id(event.id),
            "user_name": event.owner.name,
        }
    )


def send_event_accepted_notification(recipient, event):
    return send_templated_mail(
        "Your event is good to go!",
        "noreply@buildevents.today",
        [recipient],
        "event_accepted.html",
        {
            "event_url": event_url_from_id(event.id),
            "user_name": event.owner.name,
            "admin_phone_number":  "+65 81899096",
            "event_type": event.type.name,
            "attendees": event.attendees,
            "event_date": event.date,
            "duration": event.duration,
        }
    )


def seeend_event_accepted_notification(recipient, event):
    return send_templated_mail(
        "Your event is good to go!"
        "noreply@buildevents.today",
        [recipient],
        "event_accepted.html",
        {
            "event_url": event_url_from_id(event.id),
            "user_name": event.owner.name,
            "admin_phone_number":  event.owner.phone_number,
            "event_type": event.type.name,
            "attendees": event.attendees,
            "event_date": event.date,
            "duration": event.duration,
        }
    )


def send_event_cancelled_notification(recipient, event):
    return send_templated_mail(
        "Your event is cancelled",
        "noreply@buildevents.today",
        [recipient],
        "event_cancelled.html",
        {
            "event_url": event_url_from_id(event.id),
            "user_name": event.owner.name,
            "admin_name": "admin",
        }
    )

