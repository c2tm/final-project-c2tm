# Generated by Django 3.2.12 on 2022-03-13 20:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0019_alter_account_active'),
        ('posts', '0010_auto_20220313_1813'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='account',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.account'),
        ),
    ]
