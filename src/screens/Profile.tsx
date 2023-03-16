import { Center, Heading, ScrollView, Skeleton, Text, VStack } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';

import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


import { Input } from '@components/Input';
import { UserPhoto } from '@components/UserPhoto';
import { ScreenHeader } from '@components/ScreenHeader';
import { Button } from '@components/Button';

type FormDataProps = {
    name: string;
    //email: string;
    password: string;
    password_new: string;
    password_confirm: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    //email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe a senha atual.'),
    password_new: yup.string().required('Informe a nova senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    password_confirm: yup.string().required('Confirme a nova senha.').oneOf([yup.ref('password_new')], 'A confirmação da senha não confere.')
});

const PHOTO_SIZE = 33;

export function Profile(){
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/thaislarener.png');
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(profileSchema)
    });

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true);
        try{
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });
    
            if(photoSelected.canceled)
                return;
            
                if(photoSelected.assets[0].uri){
                    const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

                    //Para limitar o tamanho do arquivo que pode ser carregado
                    //if(photoInfo.size && (photo.size / 1042 / 1042) > 5){
                    //    return Alert.alert('Essa imagem é muito grande. Escolha uma de até 5MB');
                    //}
                    setUserPhoto(photoSelected.assets[0].uri);
                }
        }
        catch(error){
            console.log(error);
        }
        finally{
            setPhotoIsLoading(false);
        }
    }

    function handleProfile(data: FormDataProps){
        console.log(data);
    }
    return(
        <VStack flex={1}>
            <ScreenHeader title='Perfil'/>

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ? 
                        <Skeleton 
                            w={PHOTO_SIZE} 
                            h={PHOTO_SIZE} 
                            rounded='full'
                            startColor='gray.500'
                            endColor='gray.400'
                        />
                        :
                        <UserPhoto
                            source={{ uri: userPhoto }}
                            alt='Foto do usuário'
                            size={PHOTO_SIZE}
                        />
                    }

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={6} >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Controller 
                        control={control}
                        name='name'
                        render={({ field: {onChange, value}}) => (
                            <Input 
                                placeholder='Nome'
                                bg='gray.600'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Input 
                        bg='gray.600'
                        placeholder='E-mail'
                        isDisabled
                    />
                </Center>
                
                <VStack px={10} mt={12} mb={9}>
                    <Heading color='gray.200' fontSize='md' mb={2} fontFamily='heading'>
                        Alterar senha
                    </Heading>

                    <Controller 
                        control={control}
                        name='password'
                        render={({ field: {onChange, value}}) => (
                            <Input 
                                placeholder='Senha antiga'
                                bg='gray.600'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='password_new'
                        render={({ field: {onChange, value}}) => (
                            <Input 
                                placeholder='Nova senha'
                                bg='gray.600'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password_new?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='password_confirm'
                        render={({ field: {onChange, value}}) => (
                            <Input 
                                placeholder='Confirme a  nova senha'
                                bg='gray.600'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleProfile)}
                                returnKeyType='send'
                                errorMessage={errors.password_confirm?.message}
                            />
                        )}
                    />

                    <Button
                        title='Atualizar'
                        mt={4}
                        onPress={handleSubmit(handleProfile)}

                    />
                </VStack>
            </ScrollView>
        </VStack>
    );
}