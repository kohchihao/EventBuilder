# Generated by Django 2.2.6 on 2019-10-21 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gql', '0010_auto_20191019_1219'),
    ]

    operations = [
        migrations.AddField(
            model_name='curatedevent',
            name='description',
            field=models.CharField(blank=True, max_length=1000),
        ),
        migrations.AlterField(
            model_name='service',
            name='description',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]
