# Generated by Django 3.2.12 on 2022-03-10 21:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_account_is_active'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='active',
        ),
    ]
