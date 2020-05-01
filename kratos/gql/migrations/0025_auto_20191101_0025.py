# Generated by Django 2.2.6 on 2019-11-01 00:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gql', '0024_servicetype_allow_multiple_selection'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='events', to=settings.AUTH_USER_MODEL),
        ),
    ]
