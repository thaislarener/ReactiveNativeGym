import { Center, Heading, ScrollView, Skeleton, Text, VStack } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


import { Input } from '@components/Input';
import { UserPhoto } from '@components/UserPhoto';
import { ScreenHeader } from '@components/ScreenHeader';
import { Button } from '@components/Button';

const PHOTO_SIZE = 33;

export function Profile(){
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/thaislarener.png');

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

                    <Input 
                        bg='gray.600'
                        placeholder='Nome'
                    />
                    <Input 
                        bg='gray.600'
                        placeholder='E-mail'
                        isDisabled
                    />
                </Center>
                
                <VStack px={10} mt={12} mb={9}>
                    <Heading color='gray.200' fontSize='md' mb={2}>
                        Alterar senha
                    </Heading>

                    <Input 
                        bg='gray.600'
                        placeholder='Senha antiga'
                        secureTextEntry
                    />

                    <Input 
                        bg='gray.600'
                        placeholder='Nova senha'
                        secureTextEntry
                    />

                    <Input 
                        bg='gray.600'
                        placeholder='Confirme a nova senha'
                        secureTextEntry
                    />

                    <Button
                        title='Atualizar'
                        mt={4}
                    />
                </VStack>
            </ScrollView>
        </VStack>
    );
}