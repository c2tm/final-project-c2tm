# Generated by Django 3.2.12 on 2022-03-17 21:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0019_alter_account_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='flagged',
            field=models.BooleanField(default=False),
        ),
    ]