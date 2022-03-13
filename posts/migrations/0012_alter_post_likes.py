# Generated by Django 3.2.12 on 2022-03-13 20:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0019_alter_account_active'),
        ('posts', '0011_alter_post_account'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='post_likes', to='accounts.Account'),
        ),
    ]