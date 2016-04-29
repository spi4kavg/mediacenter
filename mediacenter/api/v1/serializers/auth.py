from rest_framework import serializers


class LoginSerializer(serializers.Serializer):

    login = serializers.CharField(allow_blank=False)
    password = serializers.CharField(allow_blank=False)

    def validate_login(self, value):
        if not value == "admin":
            raise serializers.ValidationError("Incorrect login")
        return value

    def validate_password(self, value):
        if not value == "admin":
            raise serializers.ValidationError("Incorrect password")
        return value
