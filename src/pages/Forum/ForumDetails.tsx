import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchForumThreadById, fetchThreadReplies } from "../../store/slices/forumSlice";
import {
  User,
  Calendar,
  MessageCircle,
  CheckCircle,
  XCircle,
  Heart,
  Tag,
  Paperclip,
  Loader2,
} from "lucide-react";
import { RootState } from "../../store";

const ForumDetails: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const dispatch = useDispatch();
  const { threadReplies, repliesLoading, repliesError } = useSelector(
    (state: RootState) => state.forum
  );

  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found");

        // Fetch thread details
        const threadRes = await dispatch(fetchForumThreadById({ threadId, token })).unwrap();
        setThread(threadRes);

        // Fetch replies
        await dispatch(fetchThreadReplies({ threadId, token })).unwrap();
      } catch (err: any) {
        setError(err?.message || "Failed to load thread");
      } finally {
        setLoading(false);
      }
    };

    if (threadId) fetchData();
  }, [threadId, dispatch]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Recursive Reply Component
  const ReplyItem: React.FC<{ reply: any }> = ({ reply }) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-start bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {reply.repliedBy?.fullName || "Unknown"}
            </span>
            <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
            {reply.likeCount > 0 && (
              <span className="flex items-center text-xs text-red-500 ml-2">
                <Heart className="w-3 h-3 mr-1" />
                {reply.likeCount}
              </span>
            )}
          </div>
          <div className="mt-1 text-gray-700 prose prose-sm max-w-none">{reply.content}</div>

          {reply.attachments?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {reply.attachments.map((att: any, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs"
                >
                  <Paperclip className="w-3 h-3 mr-1" />
                  {att.originalName || "Attachment"}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {reply.nestedReplies?.length > 0 && (
        <div className="ml-12 mt-2 space-y-2">
          {reply.nestedReplies.map((nested: any) => (
            <ReplyItem key={nested._id} reply={nested} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forum thread...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Thread</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Thread Not Found</h3>
          <p className="text-gray-600">The requested forum thread could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Thread Header */}
          <div className="flex items-start mb-6">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div className="ml-6 flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{thread.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {thread.createdBy?.fullName || "Unknown"}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(thread.createdAt)}
                </span>
                <span className="flex items-center">
                  <Heart className={`w-4 h-4 mr-1 ${thread.likes?.length ? "text-red-500" : "text-gray-400"}`} />
                  {thread.likeCount || 0} likes
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {thread.tags?.[0]?.split(",").map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {thread.isApproved === true ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approved
                  </span>
                ) : thread.isApproved === false ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <XCircle className="w-4 h-4 mr-1" />
                    Not Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <XCircle className="w-4 h-4 mr-1" />
                    Pending
                  </span>
                )}
                {thread.isOpenSource && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Open Source
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Thread Content */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="prose max-w-none text-gray-800">
              <p>{thread.content}</p>
            </div>
            {thread.attachments?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attachments
                </h4>
                <div className="space-y-2">
                  {thread.attachments.map((att: any, idx: number) => (
                    <div key={idx} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <Paperclip className="w-4 h-4 mr-2" />
                      {att.originalName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Replies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
              Replies ({threadReplies?.length || 0})
            </h3>

            {repliesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : repliesError ? (
              <div className="text-center text-red-500 py-8">{repliesError}</div>
            ) : threadReplies?.length > 0 ? (
              <div className="space-y-4">
                {threadReplies.map((reply) => (
                  <ReplyItem key={reply._id} reply={reply} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                <MessageCircle className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                <p>No replies yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetails;
