# Generated by Django 2.2.6 on 2019-11-10 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gql', '0029_auto_20191110_0930'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agreement',
            name='amount',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='curatedagreement',
            name='quantity',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='uninitializedagreement',
            name='amount',
            field=models.PositiveIntegerField(),
        ),
    ]
