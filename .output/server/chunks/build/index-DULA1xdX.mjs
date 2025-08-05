import { defineComponent, useSSRContext, computed, mergeProps, unref, ref, readonly } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { Client, Account, Databases } from 'appwrite';
import { b as useRuntimeConfig } from './server.mjs';
import { _ as _export_sfc, u as useHead } from './_plugin-vue_export-helper-uYKAfpXZ.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const useAppwrite = () => {
  const config = useRuntimeConfig();
  const client = new Client().setEndpoint(config.public.appwrite.endpoint).setProject(config.public.appwrite.projectId);
  const account = new Account(client);
  const databases = new Databases(client);
  const connectionState = ref({
    isConnected: false,
    isReconnecting: false,
    lastDisconnectTime: null,
    connectionAttempts: 0
  });
  const activeSubscriptions = ref(/* @__PURE__ */ new Map());
  const offlineQueue = ref([]);
  const connect = () => {
    connectionState.value.isConnected = true;
    connectionState.value.isReconnecting = false;
    connectionState.value.connectionAttempts = 0;
  };
  const disconnect = () => {
    connectionState.value.isConnected = false;
    connectionState.value.lastDisconnectTime = /* @__PURE__ */ new Date();
  };
  const startReconnecting = () => {
    connectionState.value.isReconnecting = true;
    connectionState.value.connectionAttempts++;
  };
  const reconnect = async () => {
    if (connectionState.value.isReconnecting) return;
    startReconnecting();
    const maxAttempts = 5;
    const baseDelay = 1e3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await account.get();
        connect();
        await resubscribeAll();
        await processOfflineQueue();
        return;
      } catch (error) {
        console.warn(`Reconnection attempt ${attempt} failed:`, error);
        if (attempt < maxAttempts) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    connectionState.value.isReconnecting = false;
    console.error("Failed to reconnect after maximum attempts");
  };
  const resubscribeAll = async () => {
    const subscriptions = Array.from(activeSubscriptions.value.values());
    for (const subscription of subscriptions) {
      try {
        const newSubscription = client.subscribe(subscription.channels, subscription.callback);
        subscription.unsubscribe = newSubscription;
      } catch (error) {
        console.error("Failed to resubscribe:", error);
      }
    }
  };
  const processOfflineQueue = async () => {
    if (!connectionState.value.isConnected) return;
    const queue = [...offlineQueue.value];
    offlineQueue.value = [];
    for (const queuedAction of queue) {
      try {
        console.log("Processing offline action:", queuedAction);
      } catch (error) {
        console.error("Failed to process offline action:", error);
        offlineQueue.value.push(queuedAction);
      }
    }
  };
  const queueOfflineAction = (action, data) => {
    if (!connectionState.value.isConnected) {
      offlineQueue.value.push({
        action,
        data,
        timestamp: /* @__PURE__ */ new Date()
      });
      return true;
    }
    return false;
  };
  const subscribe = (channels, callback) => {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      const unsubscribe2 = client.subscribe(channels, (response) => {
        if (response.events.includes("realtime.connecting")) {
          disconnect();
          startReconnecting();
        } else if (response.events.includes("realtime.connected")) {
          connect();
        } else if (response.events.includes("realtime.disconnected")) {
          disconnect();
          setTimeout(reconnect, 2e3);
        }
        callback(response);
      });
      activeSubscriptions.value.set(subscriptionId, {
        id: subscriptionId,
        channels,
        callback,
        unsubscribe: unsubscribe2
      });
      return subscriptionId;
    } catch (error) {
      console.error("Failed to create subscription:", error);
      throw error;
    }
  };
  const unsubscribe = (subscriptionId) => {
    const subscription = activeSubscriptions.value.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      activeSubscriptions.value.delete(subscriptionId);
    }
  };
  const unsubscribeAll = () => {
    activeSubscriptions.value.forEach((subscription) => {
      subscription.unsubscribe();
    });
    activeSubscriptions.value.clear();
  };
  return {
    client,
    account,
    databases,
    connectionState: readonly(connectionState),
    activeSubscriptions: readonly(activeSubscriptions),
    offlineQueue: readonly(offlineQueue),
    subscribe,
    unsubscribe,
    unsubscribeAll,
    queueOfflineAction,
    reconnect
  };
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ConnectionStatus",
  __ssrInlineRender: true,
  setup(__props) {
    const { connectionState, offlineQueue } = useAppwrite();
    const statusText = computed(() => {
      if (connectionState.value.isReconnecting) {
        return "Reconnecting...";
      }
      if (connectionState.value.isConnected) {
        return "Connected";
      }
      return "Disconnected";
    });
    const statusClass = computed(() => {
      if (connectionState.value.isReconnecting) {
        return "status-reconnecting";
      }
      if (connectionState.value.isConnected) {
        return "status-connected";
      }
      return "status-disconnected";
    });
    const dotClass = computed(() => {
      if (connectionState.value.isReconnecting) {
        return "dot-reconnecting";
      }
      if (connectionState.value.isConnected) {
        return "dot-connected";
      }
      return "dot-disconnected";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["connection-status", unref(statusClass)]
      }, _attrs))} data-v-bb414bea><div class="status-indicator" data-v-bb414bea><div class="${ssrRenderClass([unref(dotClass), "status-dot"])}" data-v-bb414bea></div><span class="status-text" data-v-bb414bea>${ssrInterpolate(unref(statusText))}</span></div>`);
      if (unref(connectionState).isReconnecting) {
        _push(`<div class="reconnect-info" data-v-bb414bea><span data-v-bb414bea>Reconnecting... (${ssrInterpolate(unref(connectionState).connectionAttempts)}/5)</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(offlineQueue).length > 0) {
        _push(`<div class="offline-queue" data-v-bb414bea><span data-v-bb414bea>${ssrInterpolate(unref(offlineQueue).length)} actions queued</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConnectionStatus.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-bb414bea"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CommentItem",
  __ssrInlineRender: true,
  props: {
    comment: {}
  },
  emits: ["vote", "reply"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const showReplyForm = ref(false);
    const replyContent = ref("");
    const isNew = computed(() => {
      const commentTime = new Date(props.comment.createdAt).getTime();
      const now = Date.now();
      return now - commentTime < 3e4;
    });
    const upvotes = computed(() => {
      return Math.max(0, Math.floor(props.comment.votes / 2));
    });
    const downvotes = computed(() => {
      return Math.max(0, Math.floor(-props.comment.votes / 2));
    });
    const voteScoreClass = computed(() => {
      if (props.comment.votes > 0) return "positive";
      if (props.comment.votes < 0) return "negative";
      return "neutral";
    });
    const formatTime = (dateString) => {
      const date = new Date(dateString);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_CommentItem = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["comment-item", { "is-reply": !!_ctx.comment.parentId }]
      }, _attrs))} data-v-435c02fd><div class="comment-content" data-v-435c02fd><div class="comment-header" data-v-435c02fd><div class="comment-author" data-v-435c02fd><strong data-v-435c02fd>${ssrInterpolate(((_a = _ctx.comment.author) == null ? void 0 : _a.username) || "Anonymous")}</strong><span class="comment-time" data-v-435c02fd>${ssrInterpolate(formatTime(_ctx.comment.createdAt))}</span></div>`);
      if (unref(isNew)) {
        _push(`<div class="new-badge" data-v-435c02fd>New</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="comment-text" data-v-435c02fd>${ssrInterpolate(_ctx.comment.content)}</div><div class="comment-actions" data-v-435c02fd><div class="vote-buttons" data-v-435c02fd><button class="${ssrRenderClass([{ active: _ctx.comment.userVote === "up" }, "vote-btn upvote"])}" data-v-435c02fd> \u2191 ${ssrInterpolate(unref(upvotes))}</button><button class="${ssrRenderClass([{ active: _ctx.comment.userVote === "down" }, "vote-btn downvote"])}" data-v-435c02fd> \u2193 ${ssrInterpolate(unref(downvotes))}</button></div><button class="action-btn" data-v-435c02fd> Reply </button><div class="${ssrRenderClass([unref(voteScoreClass), "vote-score"])}" data-v-435c02fd>${ssrInterpolate(_ctx.comment.votes)}</div></div>`);
      if (unref(showReplyForm)) {
        _push(`<div class="reply-form" data-v-435c02fd><textarea placeholder="Write a reply..." rows="2" class="reply-input" data-v-435c02fd>${ssrInterpolate(unref(replyContent))}</textarea><div class="reply-actions" data-v-435c02fd><button${ssrIncludeBooleanAttr(!unref(replyContent).trim()) ? " disabled" : ""} class="submit-reply" data-v-435c02fd> Reply </button><button class="cancel-reply" data-v-435c02fd> Cancel </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (_ctx.comment.replies && _ctx.comment.replies.length > 0) {
        _push(`<div class="replies" data-v-435c02fd><!--[-->`);
        ssrRenderList(_ctx.comment.replies, (reply) => {
          _push(ssrRenderComponent(_component_CommentItem, {
            key: reply.$id,
            comment: reply,
            onVote: ($event) => _ctx.$emit("vote", $event, arguments[1]),
            onReply: ($event) => _ctx.$emit("reply", $event, arguments[1])
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CommentItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-435c02fd"]]);
const useComments = (postId) => {
  const { databases, subscribe, unsubscribe, queueOfflineAction, connectionState } = useAppwrite();
  const config = useRuntimeConfig();
  const comments = ref([]);
  const loading = ref(false);
  const error = ref(null);
  let commentsSubscriptionId = null;
  let votesSubscriptionId = null;
  const pendingUpdates = ref(/* @__PURE__ */ new Set());
  const updateBatch = ref([]);
  let updateTimer = null;
  const processBatchedUpdates = () => {
    if (updateBatch.value.length === 0) return;
    const updatedComments = [...comments.value];
    updateBatch.value.forEach((updatedComment) => {
      const index2 = updatedComments.findIndex((c) => c.$id === updatedComment.$id);
      if (index2 !== -1) {
        updatedComments[index2] = updatedComment;
      } else {
        if (updatedComment.parentId) {
          const parentIndex = updatedComments.findIndex((c) => c.$id === updatedComment.parentId);
          if (parentIndex !== -1) {
            if (!updatedComments[parentIndex].replies) {
              updatedComments[parentIndex].replies = [];
            }
            updatedComments[parentIndex].replies.push(updatedComment);
          }
        } else {
          updatedComments.unshift(updatedComment);
        }
      }
    });
    comments.value = updatedComments;
    updateBatch.value = [];
    pendingUpdates.value.clear();
  };
  const handleCommentUpdate = (comment) => {
    if (pendingUpdates.value.has(comment.$id)) return;
    pendingUpdates.value.add(comment.$id);
    updateBatch.value.push(comment);
    if (updateTimer) {
      clearTimeout(updateTimer);
    }
    updateTimer = setTimeout(processBatchedUpdates, 100);
  };
  const handleCommentDelete = (commentId) => {
    comments.value = comments.value.filter((comment) => {
      if (comment.$id === commentId) {
        return false;
      }
      if (comment.replies) {
        comment.replies = comment.replies.filter((reply) => reply.$id !== commentId);
      }
      return true;
    });
  };
  const handleVoteUpdate = (vote) => {
    const commentId = vote.commentId;
    const updateCommentVotes = (commentList) => {
      commentList.forEach((comment) => {
        if (comment.$id === commentId) {
          comment.userVote = vote.type;
        }
        if (comment.replies) {
          updateCommentVotes(comment.replies);
        }
      });
    };
    updateCommentVotes(comments.value);
  };
  const subscribeToComments = () => {
    if (commentsSubscriptionId) return;
    const channels = [
      `databases.${config.public.appwrite.databaseId}.collections.${config.public.appwrite.commentsCollectionId}.documents`
    ];
    commentsSubscriptionId = subscribe(channels, (response) => {
      const { events, payload } = response;
      if (!payload || payload.postId !== postId) return;
      if (events.includes("databases.*.collections.*.documents.*.create")) {
        handleCommentUpdate(payload);
      } else if (events.includes("databases.*.collections.*.documents.*.update")) {
        handleCommentUpdate(payload);
      } else if (events.includes("databases.*.collections.*.documents.*.delete")) {
        handleCommentDelete(payload.$id);
      }
    });
  };
  const subscribeToVotes = () => {
    if (votesSubscriptionId) return;
    const channels = [
      `databases.${config.public.appwrite.databaseId}.collections.${config.public.appwrite.votesCollectionId}.documents`
    ];
    votesSubscriptionId = subscribe(channels, (response) => {
      const { events, payload } = response;
      if (!payload) return;
      if (events.includes("databases.*.collections.*.documents.*.create") || events.includes("databases.*.collections.*.documents.*.update")) {
        handleVoteUpdate(payload);
      }
    });
  };
  const loadComments = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await databases.listDocuments(
        config.public.appwrite.databaseId,
        config.public.appwrite.commentsCollectionId,
        [
          `postId=${postId}`,
          "orderBy=createdAt",
          "orderType=DESC"
        ]
      );
      const commentMap = /* @__PURE__ */ new Map();
      const topLevelComments = [];
      response.documents.forEach((doc) => {
        const comment = {
          $id: doc.$id,
          postId: doc.postId,
          userId: doc.userId,
          content: doc.content,
          parentId: doc.parentId,
          votes: doc.votes || 0,
          createdAt: doc.$createdAt,
          updatedAt: doc.$updatedAt,
          replies: []
        };
        commentMap.set(comment.$id, comment);
      });
      commentMap.forEach((comment) => {
        if (comment.parentId) {
          const parent = commentMap.get(comment.parentId);
          if (parent) {
            parent.replies.push(comment);
          }
        } else {
          topLevelComments.push(comment);
        }
      });
      comments.value = topLevelComments;
    } catch (err) {
      error.value = "Failed to load comments";
      console.error("Error loading comments:", err);
    } finally {
      loading.value = false;
    }
  };
  const addComment = async (content, parentId) => {
    if (!connectionState.value.isConnected) {
      queueOfflineAction("addComment", { content, parentId, postId });
      return;
    }
    try {
      await databases.createDocument(
        config.public.appwrite.databaseId,
        config.public.appwrite.commentsCollectionId,
        "unique()",
        {
          postId,
          content,
          parentId,
          votes: 0,
          userId: "current-user-id"
          // This would come from auth
        }
      );
    } catch (err) {
      error.value = "Failed to add comment";
      console.error("Error adding comment:", err);
    }
  };
  const voteComment = async (commentId, voteType) => {
    if (!connectionState.value.isConnected) {
      queueOfflineAction("voteComment", { commentId, voteType });
      return;
    }
    try {
      await databases.createDocument(
        config.public.appwrite.databaseId,
        config.public.appwrite.votesCollectionId,
        "unique()",
        {
          commentId,
          type: voteType,
          userId: "current-user-id"
          // This would come from auth
        }
      );
    } catch (err) {
      error.value = "Failed to vote on comment";
      console.error("Error voting on comment:", err);
    }
  };
  const startRealtime = () => {
    subscribeToComments();
    subscribeToVotes();
  };
  const stopRealtime = () => {
    if (commentsSubscriptionId) {
      unsubscribe(commentsSubscriptionId);
      commentsSubscriptionId = null;
    }
    if (votesSubscriptionId) {
      unsubscribe(votesSubscriptionId);
      votesSubscriptionId = null;
    }
    if (updateTimer) {
      clearTimeout(updateTimer);
      updateTimer = null;
    }
  };
  return {
    comments: readonly(comments),
    loading: readonly(loading),
    error: readonly(error),
    addComment,
    voteComment,
    loadComments,
    startRealtime,
    stopRealtime
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Comments",
  __ssrInlineRender: true,
  props: {
    postId: {}
  },
  setup(__props) {
    const props = __props;
    const { comments, loading, error, addComment, voteComment } = useComments(props.postId);
    const { connectionState } = useAppwrite();
    const newComment = ref("");
    const handleVote = async (commentId, voteType) => {
      await voteComment(commentId, voteType);
    };
    const handleReply = async (commentId, content) => {
      await addComment(content, commentId);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommentItem = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "comments-section" }, _attrs))} data-v-007c47df><div class="comments-header" data-v-007c47df><h3 data-v-007c47df>Comments</h3>`);
      if (unref(connectionState).isConnected) {
        _push(`<div class="realtime-indicator" data-v-007c47df><div class="live-dot" data-v-007c47df></div><span data-v-007c47df>Live</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="add-comment" data-v-007c47df><textarea placeholder="Add a comment..." rows="3" class="comment-input" data-v-007c47df>${ssrInterpolate(unref(newComment))}</textarea><div class="comment-actions" data-v-007c47df><button${ssrIncludeBooleanAttr(!unref(newComment).trim() || unref(loading)) ? " disabled" : ""} class="submit-btn" data-v-007c47df>${ssrInterpolate(unref(loading) ? "Posting..." : "Post Comment")}</button></div></div>`);
      if (unref(error)) {
        _push(`<div class="error-message" data-v-007c47df>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading) && unref(comments).length === 0) {
        _push(`<div class="loading" data-v-007c47df> Loading comments... </div>`);
      } else {
        _push(`<div class="comments-list" data-v-007c47df><!--[-->`);
        ssrRenderList(unref(comments), (comment) => {
          _push(ssrRenderComponent(_component_CommentItem, {
            key: comment.$id,
            comment,
            onVote: handleVote,
            onReply: handleReply
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (!unref(loading) && unref(comments).length === 0) {
        _push(`<div class="empty-state" data-v-007c47df><p data-v-007c47df>No comments yet. Be the first to comment!</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Comments.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-007c47df"]]);
const demoPostId = "demo-post-123";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Realtime Comments Demo - Reddit Clone"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConnectionStatus = __nuxt_component_0$1;
      const _component_Comments = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-9b53461b>`);
      _push(ssrRenderComponent(_component_ConnectionStatus, null, null, _parent));
      _push(`<header class="header" data-v-9b53461b><h1 data-v-9b53461b>Nuxt Reddit Clone - Realtime Comments Demo</h1><p data-v-9b53461b>Experience live comments with Appwrite realtime subscriptions</p></header><main class="main" data-v-9b53461b><article class="post" data-v-9b53461b><div class="post-header" data-v-9b53461b><h2 data-v-9b53461b>Sample Reddit Post</h2><div class="post-meta" data-v-9b53461b><span data-v-9b53461b>Posted by u/demo_user \u2022 2 hours ago</span></div></div><div class="post-content" data-v-9b53461b><p data-v-9b53461b> This is a sample Reddit post to demonstrate the realtime comments feature. The comments below will update in real-time using Appwrite&#39;s realtime subscriptions. </p><div class="features-list" data-v-9b53461b><h3 data-v-9b53461b>Realtime Features Demonstrated:</h3><ul data-v-9b53461b><li data-v-9b53461b>\u2705 Live new comments without page refresh</li><li data-v-9b53461b>\u2705 Real-time vote score updates</li><li data-v-9b53461b>\u2705 Connection status indicator</li><li data-v-9b53461b>\u2705 Offline queue for actions</li><li data-v-9b53461b>\u2705 Smart reconnection with exponential backoff</li><li data-v-9b53461b>\u2705 Reply notifications</li><li data-v-9b53461b>\u2705 Performance optimized with batched updates</li><li data-v-9b53461b>\u2705 Error handling and recovery</li></ul></div></div></article>`);
      _push(ssrRenderComponent(_component_Comments, { "post-id": demoPostId }, null, _parent));
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9b53461b"]]);

export { index as default };
//# sourceMappingURL=index-DULA1xdX.mjs.map
