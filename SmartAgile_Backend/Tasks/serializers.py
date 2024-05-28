from rest_framework import serializers
from .models import Task
from Projects.models import ProjectMembers
from Projects.serializers import ProjectMemberSerializer

class TaskSerializer(serializers.ModelSerializer):
    #username = serializers.CharField(source='assigned_to.profile.user.username')
    assigned_to = ProjectMemberSerializer(read_only=True)
    class Meta:
        model = Task
        fields = '__all__'

    def validate(self,data):
        project = data.get('project')
        assigned_to = data.get('assigned_to')
    
        if assigned_to:
            
            is_member = ProjectMembers.objects.filter(project=project, profile=assigned_to.id).exists()
            if not is_member:
                raise serializers.ValidationError({'assigned_to': 'The assigned member is not part of the project.'})
        
        return data