# Generated by Django 3.2.12 on 2022-03-08 14:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_account'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='alltime_points',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]