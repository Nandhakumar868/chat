# Generated by Django 5.0.1 on 2024-04-30 07:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Projects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tasks',
            fields=[
                ('task_id', models.AutoField(primary_key=True, serialize=False)),
                ('task_name', models.CharField(max_length=100, unique=True)),
                ('task_deadline', models.CharField(max_length=10)),
                ('task_priority', models.CharField(max_length=15)),
                ('task_desc', models.CharField(max_length=255)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_tasks', to='Projects.projects')),
            ],
        ),
    ]