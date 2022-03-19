# Generated by Django 3.2.12 on 2022-03-19 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0019_alter_answer_points_wagered'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='phase',
            field=models.CharField(choices=[('SB', 'Submitted'), ('PB', 'Published'), ('RJ', 'Rejected')], default='SB', max_length=2),
        ),
    ]
