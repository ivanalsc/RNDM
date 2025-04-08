import { createClient } from '@supabase/supabase-js'

// Estas variables de entorno deben configurarse en tu proyecto
// Puedes obtenerlas desde el panel de control de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las entradas de medios
export interface MediaEntry {
  id?: string
  user_id?: string
  media_type: 'movie' | 'book' | 'music'
  title: string
  creator: string
  cover_url: string
  comment: string
  is_public: boolean
  created_at?: string
  likes_count?: number
  comments_count?: number
  is_liked?: boolean | null
}

// Tipos para los comentarios
export interface MediaComment {
  id: string
  user_id: string
  entry_id: string
  content: string
  created_at: string
}

// Funciones para interactuar con la base de datos
export async function createMediaEntry(entry: Omit<MediaEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('media_entries')
    .insert([entry])
    .select()
  
  if (error) {
    console.error('Error creating media entry:', error)
    throw error
  }
  
  return data[0]
}

export async function getMediaEntries(userId?: string, isPublic: boolean = true) {
  let query = supabase
    .from('media_entries')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  if (isPublic) {
    query = query.eq('is_public', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching media entries:', error)
    throw error
  }
  
  // Obtener el conteo de likes y comentarios para cada entrada
  const entriesWithCounts = await Promise.all(
    (data as MediaEntry[]).map(async (entry) => {
      if (!entry.id) return entry
      
      // Obtener conteo de likes
      const { count: likesCount } = await supabase
        .from('media_likes')
        .select('*', { count: 'exact', head: true })
        .eq('entry_id', entry.id)
      
      // Obtener conteo de comentarios
      const { count: commentsCount } = await supabase
        .from('media_comments')
        .select('*', { count: 'exact', head: true })
        .eq('entry_id', entry.id)
      
      // Verificar si el usuario actual ha dado like
      let isLiked: boolean | null = false
      if (userId) {
        const { data: likeData } = await supabase
          .from('media_likes')
          .select('*')
          .eq('entry_id', entry.id)
          .eq('user_id', userId)
          .limit(1)
        
        isLiked = likeData && likeData.length > 0
      }
      
      return {
        ...entry,
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        is_liked: isLiked
      }
    })
  )
  
  return entriesWithCounts as MediaEntry[]
}

export async function getUserMediaEntries(userId: string) {
  const { data, error } = await supabase
    .from('media_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user media entries:', error)
    throw error
  }
  
  return data as MediaEntry[]
}

export async function deleteMediaEntry(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('media_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting entry:', error)
    throw error
  }
}

// Funciones para likes
export async function toggleLike(entryId: string, userId: string): Promise<boolean> {
  // Verificar si ya existe un like
  const { data: existingLike } = await supabase
    .from('media_likes')
    .select('*')
    .eq('entry_id', entryId)
    .eq('user_id', userId)
    .limit(1)
  
  if (existingLike && existingLike.length > 0) {
    // Si ya existe, eliminar el like
    const { error } = await supabase
      .from('media_likes')
      .delete()
      .eq('entry_id', entryId)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error removing like:', error)
      throw error
    }
    
    return false // Like eliminado
  } else {
    // Si no existe, crear un nuevo like
    const { error } = await supabase
      .from('media_likes')
      .insert([{ entry_id: entryId, user_id: userId }])
    
    if (error) {
      console.error('Error adding like:', error)
      throw error
    }
    
    return true // Like añadido
  }
}

// Funciones para comentarios
export async function getComments(entryId: string): Promise<MediaComment[]> {
  const { data, error } = await supabase
    .from('media_comments')
    .select('*')
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching comments:', error)
    throw error
  }
  
  return data as MediaComment[]
}

export async function addComment(entryId: string, userId: string, content: string): Promise<MediaComment> {
  const { data, error } = await supabase
    .from('media_comments')
    .insert([{ entry_id: entryId, user_id: userId, content }])
    .select()
  
  if (error) {
    console.error('Error adding comment:', error)
    throw error
  }
  
  return data[0] as MediaComment
}

export async function deleteComment(commentId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('media_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
    throw error
  }
  
  return user
} 