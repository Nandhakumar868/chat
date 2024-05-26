from django.contrib import admin
from .models import Project , ProjectMembers
# Register your models here.

class ProjectAdmin(admin.ModelAdmin):
    list_display = ['proj_id','proj_name' , 'proj_deadline' , 'proj_desc']
    list_filter = ['organization' , 'status']

class ProjectMembersAdmin(admin.ModelAdmin):
    list_display = ['id','project', 'profile', 'role_within_project']

admin.site.register(ProjectMembers, ProjectMembersAdmin)
admin.site.register(Project , ProjectAdmin)
