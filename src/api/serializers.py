from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from api.models import InfoActe
from configurations.models import KeyValueData, User, Bureau, ModeReglement, \
    Civilite, QualiteBeneficiaire, Pays, Profession
from production.models import Client, FormuleGarantie, CarteDigitalDematerialisee
from sinistre.models import Sinistre



class InfoActeSerialiser(ModelSerializer):
    class Meta:
        model = InfoActe
        fields = ['numero_assure', 'medecin', 'acte', 'affection', 'rc']
        managed = False


class CiviliteSerializer(ModelSerializer):
    class Meta:
        model = Civilite
        fields = ['id', 'code', 'name']
        managed = False


class QualiteBeneficiaireSerializer(ModelSerializer):
    class Meta:
        model = QualiteBeneficiaire
        fields = ['id', 'code', 'libelle']
        managed = False

class PaysSerializer(ModelSerializer):
    class Meta:
        model = Pays
        fields = ['id', 'nom', 'indicatif']
        managed = False
        # depth = 1


class ProfessionSerializer(ModelSerializer):
    class Meta:
        model = Profession
        fields = ['id', 'code', 'name']
        managed = False
        # depth = 1



# APPLICATION MOBILE SANTE API REST SERIALIZER
class KeyValueDataSerializer(ModelSerializer):
    class Meta:
        model = KeyValueData
        fields = "__all__"
        managed = False


class ClientSerializer(ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"
        # depth = 3
        # extra_kwargs = {'user_extranet': {'write_only': True}}

# class CourrierSerializer(ModelSerializer):
#     class Meta:
#         model = Courrier
#         fields = "__all__"


class FormuleGarantieSerializer(ModelSerializer):
    class Meta:
        model = FormuleGarantie
        fields = "__all__"
        depth = 1
        # extra_kwargs = {'user_extranet': {'write_only': True}}


class UserDataSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {'password': {'write_only': True}}
        # depth = 1

class PrestataireDataSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {'password': {'write_only': True}}
        depth = 2


class UserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, required=False, write_only=True)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data.get('password', user.password))
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        if validated_data.get('password', None):
            instance.set_password(validated_data.get('password', instance.password))
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance


class CreateUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128)

    def create(self, validated_data):
        user = User(email=validated_data.get('email', None),
                    username=validated_data.get('username', None))
        user.set_password(validated_data.get('password', user.password))
        return user


class ResetPasswordUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128)

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        if validated_data.get('password', None):
            instance.set_password(validated_data.get('password', instance.password))
        instance.save()
        return instance


class SinisteSerializer(ModelSerializer):
    class Meta:
        model = Sinistre
        fields = "__all__"
        depth = 1
        # extra_kwargs = {'user_extranet': {'write_only': True}}


class BureauSerializer(ModelSerializer):
    class Meta:
        model = Bureau
        fields = "__all__"
        # exclude = ['rubrique','regroupement_acte','type_acte',]
        # depth = 1
        # extra_kwargs = {'user_extranet': {'write_only': True}}

class ModeRemboursementSerializer(ModelSerializer):
    class Meta:
        model = ModeReglement
        fields = ['id', 'libelle']


class CarteDigitalDematerialiseeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarteDigitalDematerialisee
        fields = ['id', 'user', 'has_digital_card', 'digital_card_url', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'user': {'required': True},
            'digital_card_url': {'required': True}
        }

    def create(self, validated_data):
        user = validated_data.pop('user', None)
        digital_card = CarteDigitalDematerialisee.objects.create(user=user, **validated_data)
        return digital_card