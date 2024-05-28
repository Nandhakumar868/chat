from django.urls import path
from .views import ProjectView , status_choices , ProjectMemberView, UserProjectView, ProjectMemberDetailView

urlpatterns = [
    path('', ProjectView.as_view(), name='Project Created'),
    path('status-choices/' , status_choices , name="Status Choices"),
    path('<int:proj_id>/', ProjectView.as_view(), name='Projects Details'),
    path('organization/<int:organization>/', ProjectView.as_view(), name='Projects to organization'),
    
    path('project-members/' , ProjectMemberView.as_view() , name="Project Members All"),
    path('project-members/<int:project>/' , ProjectMemberView.as_view() , name="ProjectMembers"),

    path('user-projects/<int:user_id>/', UserProjectView.as_view(), name='user_projects'),

    path('user-details/<int:id>/', ProjectMemberDetailView.as_view(), name='user-details'),
]
