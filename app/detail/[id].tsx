import React, { useCallback, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchContactDetails,
  selectSelectedContact,
  setFavoriteContact
} from '@/slices/contactsSlice'
import { useRouter, useGlobalSearchParams } from 'expo-router'
import type { AppDispatch } from '@/store'
import type { Contact } from 'expo-contacts'

interface Styles {
  container: StyleProp<ViewStyle>
  backContainer: StyleProp<ViewStyle>
  backButton: StyleProp<ViewStyle>
  content: StyleProp<ViewStyle>
  nameContainer: StyleProp<ViewStyle>
  avatarContainer: StyleProp<ViewStyle>
  avatar: StyleProp<ImageStyle>
  textName: StyleProp<TextStyle>
  stickyButtonContainer: StyleProp<ViewStyle>
  stickyButton: StyleProp<ViewStyle>
  buttonText: StyleProp<TextStyle>
  white: StyleProp<TextStyle>
  dataRow: StyleProp<ViewStyle>
  label: StyleProp<TextStyle>
  textData: StyleProp<TextStyle>
}

const Detail: React.FC = () => {
  const router = useRouter()
  const { id } = useGlobalSearchParams()
  const selectedContact = useSelector(selectSelectedContact)
  const dispatch = useDispatch<AppDispatch>()

  const fetchContactDetailsData = useCallback(() => {
    if (id) {
      dispatch(fetchContactDetails(id))
    }
  }, [dispatch, id])

  const handleSetFavorite = (contact: Contact) => {
    dispatch(setFavoriteContact(contact))
  }

  useEffect(() => {
    fetchContactDetailsData()
  }, [fetchContactDetailsData])

  const renderContactDetails = () => {
    if (!selectedContact) return null

    return (
      <>
        {selectedContact.phoneNumbers?.map((phone, index) => (
          <View key={`phone-${index}`} style={styles.dataRow}>
            <Text style={styles.label}>Phone ({phone.label})</Text>
            <Text style={styles.textData}>{phone.number}</Text>
          </View>
        ))}
        {selectedContact.emails?.map((email, index) => (
          <View key={`email-${index}`} style={styles.dataRow}>
            <Text style={styles.label}>Email ({email.label})</Text>
            <Text style={styles.textData}>{email.email}</Text>
          </View>
        ))}
        {selectedContact.addresses?.map((address, index) => (
          <View key={`address-${index}`} style={styles.dataRow}>
            <Text style={styles.label}>Address ({address.label})</Text>
            <Text style={styles.textData}>
              {address.street}, {address.city}, {address.region}, {address.country},{' '}
              {address.postalCode}
            </Text>
          </View>
        ))}
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
          <Text style={styles.white}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.textName}>{selectedContact?.firstName}</Text>
        <Text style={styles.textName}>{selectedContact?.lastName}</Text>
        <Text style={styles.textName}>{selectedContact?.nameSuffix}</Text>
      </View>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={require('@/assets/images/user.png')} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {renderContactDetails()}
        <Text style={styles.white}>This is the main content of the page.</Text>
        <Text style={styles.white}>This is the main content of the page.</Text>
      </ScrollView>
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity
          style={styles.stickyButton}
          onPress={() => selectedContact && handleSetFavorite(selectedContact)}
        >
          <Text style={styles.buttonText}>Favorite</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles: Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a'
  },
  backContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 56,
    backgroundColor: '#fff',
    gap: 16
  },
  nameContainer: {
    padding: 16,
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -40,
    zIndex: 1
  },
  avatar: {
    width: 80,
    height: 80
  },
  textName: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold'
  },
  stickyButtonContainer: {
    backgroundColor: '#fff',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  stickyButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
  white: {
    color: '#fff'
  },
  dataRow: {
    gap: 4
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12
  },
  textData: {
    fontSize: 14
  }
})

export default Detail
