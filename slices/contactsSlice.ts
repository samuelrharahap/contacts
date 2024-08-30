// slices/contactsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as Contacts from 'expo-contacts'
import { Contact } from 'expo-contacts'
import type { RootState } from '@/store'

interface ContactsState {
  contacts: Contact[]
  error: string | null
  favoriteContact: Contact | null
  selectedContact: Contact | null
}

const initialState: ContactsState = {
  contacts: [],
  error: null,
  favoriteContact: null,
  selectedContact: null
}

const sortContactsByFirstName = (contacts: Contact[]): Contact[] => {
  return contacts.sort((a, b) => {
    const nameA = a.firstName?.toLowerCase() || ''
    const nameB = b.firstName?.toLowerCase() || ''
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
}

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const { status } = await Contacts.requestPermissionsAsync()
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers]
        })
        return data
      } else {
        throw new Error('Permission not granted')
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const fetchContactDetails = createAsyncThunk(
  'contacts/fetchContactDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const { status } = await Contacts.requestPermissionsAsync()
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync()
        const contact = data.find((contact) => contact.id === id)

        if (contact) {
          return contact
        } else {
          throw new Error('Contact not found')
        }
      } else {
        throw new Error('Permission not granted')
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setFavoriteContact(state, action) {
      state.favoriteContact = action.payload
    },
    removeFavoriteContact(state) {
      state.favoriteContact = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts = sortContactsByFirstName(action.payload)
        state.error = null
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(fetchContactDetails.fulfilled, (state, action) => {
        state.selectedContact = action.payload
        state.error = null
      })
      .addCase(fetchContactDetails.rejected, (state, action) => {
        state.error = action.payload as string
        state.selectedContact = null
      })
  }
})

export const { setFavoriteContact, removeFavoriteContact } = contactsSlice.actions

export const selectContacts = (state: RootState) => state.contacts.contacts
export const selectError = (state: RootState) => state.contacts.error
export const selectFavoriteContact = (state: RootState) => state.contacts.favoriteContact
export const selectSelectedContact = (state: RootState) => state.contacts.selectedContact

export default contactsSlice.reducer
