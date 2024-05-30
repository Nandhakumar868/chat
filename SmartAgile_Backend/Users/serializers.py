from rest_framework import serializers
from .models import User, UserProfile
from rest_framework.exceptions import ValidationError
from django.core.files.base import ContentFile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id','username','password','email', 'image']

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username'],
            email = validated_data['email']
        )
        user.set_password(validated_data['password'])

        image_field = validated_data.get('image', None)
        if image_field:
            if not image_field.content:
                user.image = None
            else:
                user.image.save(image_field.name, ContentFile(image_field.read()))
                
        user.save()
        return user
    
    def validate_email(self,value):
        if User.objects.filter(email = value).exists():
            raise ValidationError('A user with that email already exist!')
        return value
    
class LoginSerializer(serializers.Serializer):  
     email = serializers.EmailField()
     password = serializers.CharField(style={'input_type': 'password'})


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate(self, data):
        email = data.get('email')
        try:
            user = User. objects.get(email=email)
            # if not user.has_usable_password():
            #     raise serializers.ValidationError('Invalid data')
        except User.DoesNotExist:
            raise serializers.ValidationError('Email address not found !')
        return data
    
class PasswordResetConfirmOtpSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6,required=True)

    def validate(self, data):
        try:
            otp = data.get('otp')
            user = User.objects.get(otp=otp)
            if not user:
                raise serializers.ValidationError('Invalid OTP')
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid OTP')
        return data

class PasswordResetConfirmSerializer(serializers.Serializer):
    otp = serializers.IntegerField(required=True)
    new_password = serializers.CharField(required=True,write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        otp = data.get('otp')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if not new_password or not confirm_password:
            raise serializers.ValidationError('Passwords are required')
        
        if len(new_password) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long')
        
        if new_password != confirm_password:
            raise serializers.ValidationError('Passwords do not match')
        
        try:
            user = User.objects.get(otp = otp)
        except User.DoesNotExist:
            return None
        return data
    
    def update(self, instance, validated_data):
        user = User.objects.get(otp = validated_data['otp'])
        user.set_password(validated_data['new_password'])
        user.otp = None
        user.save()
        return user
         
class SuperuserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id','username', 'password' ,'email']

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username'],
            email = validated_data['email'],
            is_superuser = True,
            is_staff = True
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_email(self,value):
        if User.objects.filter(email = value).exists():
            raise ValidationError('A Superuser with that email already exist!')
        return value  

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source = 'user.email')
    username = serializers.CharField(source = 'user.username')
    image = serializers.CharField(source = 'user.image')
    class Meta:
        model = UserProfile
        fields = '__all__'