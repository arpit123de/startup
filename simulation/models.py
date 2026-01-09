from django.db import models

# Create your models here.
class StartupSimulation(models.Model):
    idea = models.TextField()
    domain = models.CharField(max_length=50)
    target_users = models.CharField(max_length=50)
    budget = models.CharField(max_length=50)

    ai_suggestions = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

