import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme';
import { mockActivities } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export default function PostDetailScreen({ route, navigation }: any) {
  const { postId } = route.params || {};
  const { user } = useAuth();
  const post = mockActivities.find((a: any) => a.id === postId) || mockActivities[0];

  const [comments, setComments] = useState([
    { id: 'c1', userName: 'Lucas Mendes', userAvatar: 'https://i.pravatar.cc/150?u=c1', content: 'Boa, monstro! 💪', time: 'Há 1h' },
    { id: 'c2', userName: 'Mariana Silva', userAvatar: 'https://i.pravatar.cc/150?u=c2', content: 'Inspirador! Amanhã é minha vez.', time: 'Há 30m' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, {
      id: Date.now().toString(),
      userName: user?.name || 'Você',
      userAvatar: 'https://i.pravatar.cc/150?u=me',
      content: newComment,
      time: 'Agora'
    }]);
    setNewComment('');
  };

  if (!post) {
    return (
      <View style={s.container}>
        <Text style={{ color: 'white' }}>Post não encontrado</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.colors.bgPrimary }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView style={s.container}>
        {/* Post Content */}
        <View style={s.postCard}>
          <View style={s.feedHeader}>
            <Image source={{ uri: post.userAvatar }} style={s.avatar} />
            <View>
              <Text style={s.feedName}>{post.userName}</Text>
              <Text style={s.feedTime}>{post.time}</Text>
            </View>
          </View>
          <Text style={s.feedContent}>{post.content}</Text>
          {post.photo && <Image source={{ uri: post.photo }} style={s.feedPhoto} />}
          <View style={s.feedActions}>
            <Text style={s.actionText}>❤️ {post.likes} curtiu</Text>
            <Text style={s.actionText}>💬 {comments.length} comentários</Text>
          </View>
        </View>

        {/* Comments Section */}
        <Text style={s.sectionTitle}>Comentários</Text>
        {comments.map(c => (
          <View key={c.id} style={s.commentItem}>
            <Image source={{ uri: c.userAvatar }} style={s.commentAvatar} />
            <View style={s.commentBody}>
              <View style={s.commentHeader}>
                <Text style={s.commentName}>{c.userName}</Text>
                <Text style={s.commentTime}>{c.time}</Text>
              </View>
              <Text style={s.commentText}>{c.content}</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Input Area */}
      <View style={s.inputContainer}>
        <TextInput
          style={s.input}
          placeholder="Adicione um comentário..."
          placeholderTextColor={theme.colors.textMuted}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={s.sendBtn} onPress={handleComment} disabled={!newComment.trim()}>
          <Text style={[s.sendText, !newComment.trim() && { opacity: 0.5 }]}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  postCard: { backgroundColor: theme.colors.bgSecondary, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border },
  feedHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  feedName: { fontWeight: '700', color: theme.colors.textPrimary, fontSize: 16 },
  feedTime: { fontSize: 12, color: theme.colors.textMuted },
  feedContent: { fontSize: 15, color: theme.colors.textPrimary, marginBottom: 12, lineHeight: 22 },
  feedPhoto: { width: '100%', height: 250, borderRadius: 12, marginBottom: 12 },
  feedActions: { flexDirection: 'row', gap: 20, marginTop: 4 },
  actionText: { fontSize: 13, color: theme.colors.textMuted },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 16 },
  commentItem: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentBody: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentName: { fontWeight: '600', color: theme.colors.textPrimary, fontSize: 13 },
  commentTime: { fontSize: 11, color: theme.colors.textMuted },
  commentText: { color: theme.colors.textPrimary, fontSize: 14, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', padding: 12, gap: 10, backgroundColor: theme.colors.bgSecondary, borderTopWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  input: { flex: 1, height: 44, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 22, paddingHorizontal: 16, color: 'white', borderColor: theme.colors.border, borderWidth: 1 },
  sendBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, height: 44, justifyContent: 'center', borderRadius: 22 },
  sendText: { color: 'white', fontWeight: '600' }
});
