from django.urls import path
from .views import startup_page,canvas,run_step

urlpatterns = [
    path("startup/", startup_page, name= 'startup'),   # PAGE
    path("canvas/",canvas,name ='canvas'),
    path("run-simulation/",run_step,name='run-simulation')
]
