from rest_framework import serializers
from .models import Project , ProjectMembers

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        
class ProjectMemberSerializer(serializers.ModelSerializer):
    user = serializers.IntegerField(source='profile.user.id')
    username = serializers.CharField(source = 'profile.user.username')
    image = serializers.CharField(source='profile.user.image')
    class Meta:
        model = ProjectMembers
        fields = '__all__'


# class ProjectMemberDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProjectMembers
#         fields = '__all__'