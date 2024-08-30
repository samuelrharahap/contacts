import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native'
import { Link } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchContacts,
  selectContacts,
  selectError,
  selectFavoriteContact
} from '@/slices/contactsSlice'
import type { AppDispatch } from '@/store'
import type { Contact } from 'expo-contacts'

// Define a type for styles
interface Styles {
  container: StyleProp<ViewStyle>
  header: StyleProp<ViewStyle>
  title: StyleProp<TextStyle>
  searchBox: StyleProp<TextStyle>
  favoriteContainer: StyleProp<ViewStyle>
  favorite: StyleProp<ViewStyle>
  favoriteTitle: StyleProp<TextStyle>
  favoriteName: StyleProp<TextStyle>
  contactsContainer: StyleProp<ViewStyle>
  contact: StyleProp<ViewStyle>
  avatar: StyleProp<ImageStyle>
  contactText: StyleProp<TextStyle>
  contactPhone: StyleProp<TextStyle>
  error: StyleProp<TextStyle>
  textCenter: StyleProp<TextStyle>
  favoriteIcon: StyleProp<ImageStyle>
  flexGrow: StyleProp<ViewStyle>
  full: StyleProp<ViewStyle>
}

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const contacts = useSelector(selectContacts)
  const favoriteContact = useSelector(selectFavoriteContact)
  const error = useSelector(selectError)
  const [keyword, setKeyword] = useState<string>('')

  const fetchContactsData = useCallback(() => {
    dispatch(fetchContacts())
  }, [dispatch])

  useEffect(() => {
    fetchContactsData()
  }, [fetchContactsData])

  const filteredContacts = contacts.filter((contact: Contact) =>
    contact.name?.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" backgroundColor="black" />
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <TextInput
          style={styles.searchBox}
          onChangeText={setKeyword}
          value={keyword}
          placeholder="Search"
          placeholderTextColor="white"
        />
      </View>
      {favoriteContact?.firstName && (
        <View style={styles.favoriteContainer}>
          <Text style={styles.favoriteTitle}>Favorites</Text>
          <View style={styles.favorite}>
            <Image style={styles.avatar} source={require('@/assets/images/user.png')} />
            <Text style={styles.favoriteName}>{favoriteContact.firstName}</Text>
          </View>
        </View>
      )}
      <ScrollView style={styles.contactsContainer}>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : filteredContacts.length ? (
          filteredContacts.map((contact) => (
            <Link style={styles.full} href={`/detail/${contact.id}`} key={contact.id}>
              <View style={styles.contact}>
                <Image style={styles.avatar} source={require('@/assets/images/user.png')} />
                <View style={styles.flexGrow}>
                  <Text style={styles.contactText}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>
                    {contact.phoneNumbers?.[0]?.number || '-'}
                  </Text>
                </View>
                {favoriteContact?.id === contact.id && (
                  <Image style={styles.favoriteIcon} source={require('@/assets/images/star.png')} />
                )}
              </View>
            </Link>
          ))
        ) : (
          <Text style={styles.textCenter}>Not found</Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles: Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a'
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    gap: 16
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 32
  },
  searchBox: {
    backgroundColor: '#323232',
    color: '#fff',
    padding: 16,
    borderRadius: 32,
    marginBottom: 16
  },
  favoriteContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16
  },
  favorite: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  favoriteTitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold'
  },
  favoriteName: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center'
  },
  contactsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#fff'
  },
  contact: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeaea',
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  contactText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  contactPhone: {
    fontSize: 12
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16
  },
  textCenter: {
    textAlign: 'center'
  },
  favoriteIcon: {
    width: 24,
    height: 24
  },
  flexGrow: {
    flexGrow: 1
  },
  full: {
    width: '100%'
  }
})

export default HomeScreen
