import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './PostDetailPage.css';

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  time: string;
}

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<api.Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    api.getActivity(postId)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [postId]);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
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

  if (loading) return <div style={{ color: 'white', padding: 20 }}>Carregando...</div>;
  if (!post) return <div style={{ color: 'white', padding: 20 }}>Post não encontrado.</div>;

  return (
    <div className="post-detail-page">
      <div className="post-detail-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← Voltar</button>
        <h1>Publicação</h1>
      </div>

      <div className="post-content glass-card">
        <div className="post-author-row">
          <img src={post.userAvatar || 'https://i.pravatar.cc/150'} alt="" className="feed-avatar" onClick={() => navigate(`/user/${post.userId}`)} style={{ cursor: 'pointer' }} />
          <div>
            <strong onClick={() => navigate(`/user/${post.userId}`)} style={{ cursor: 'pointer' }}>{post.userName}</strong>
            <span className="feed-time">{post.time || new Date(post.createdAt || '').toLocaleDateString()}</span>
          </div>
        </div>
        <p className="post-text">{post.content}</p>
        {post.photo && <img src={post.photo} alt="Post" className="post-image" />}
        <div className="feed-actions">
          <span>❤️ {post.likes} curtiu</span>
          <span>💬 {comments.length} comentários</span>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comentários</h3>
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item glass-card">
              <img src={c.userAvatar} alt="" className="comment-avatar" />
              <div className="comment-body">
                <div className="comment-header">
                  <strong>{c.userName}</strong>
                  <span className="comment-time">{c.time}</span>
                </div>
                <p>{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="comment-form" onSubmit={handleComment}>
          <input 
            type="text" 
            placeholder="Adicione um comentário..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
          />
          <button type="submit" disabled={!newComment.trim()}>Enviar</button>
        </form>
      </div>
    </div>
  );
}
