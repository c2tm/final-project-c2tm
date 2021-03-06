# Generated by Django 3.2.12 on 2022-03-14 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0012_alter_post_likes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='user_answer',
            field=models.CharField(choices=[('answer1', 'Answer_1'), ('answer2', 'Answer_2')], max_length=7),
        ),
        migrations.AlterField(
            model_name='post',
            name='correct_answer',
            field=models.CharField(choices=[('answer1', 'Answer_1'), ('answer2', 'Answer_2')], default='answer1', max_length=7),
        ),
    ]
