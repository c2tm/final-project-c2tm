# Generated by Django 3.2.12 on 2022-03-07 21:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='answer1',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='answer2',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='phase',
            field=models.CharField(choices=[('SB', 'Submitted'), ('PB', 'Published')], default='SB', max_length=2),
        ),
        migrations.AddField(
            model_name='post',
            name='question',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
