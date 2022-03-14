# Generated by Django 3.2.12 on 2022-03-14 14:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0019_alter_account_active'),
        ('posts', '0013_auto_20220314_1426'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='answer',
            name='user',
        ),
        migrations.AddField(
            model_name='answer',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.account'),
        ),
        migrations.AddField(
            model_name='post',
            name='answers',
            field=models.ManyToManyField(through='posts.Answer', to='accounts.Account'),
        ),
        migrations.AlterField(
            model_name='post',
            name='account',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_account', to='accounts.account'),
        ),
    ]