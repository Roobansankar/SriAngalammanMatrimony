// constants/notificationTypes.js
// Notification type constants for push notifications

const NotificationType = {
  // Phone number requests
  PHONE_REQUEST: 'phone_request',
  PHONE_ACCEPTED: 'phone_accepted',
  PHONE_REJECTED: 'phone_rejected',

  // Chat requests
  CHAT_REQUEST: 'chat_request',
  CHAT_ACCEPTED: 'chat_accepted',
  CHAT_REJECTED: 'chat_rejected',

  // Messages
  NEW_MESSAGE: 'new_message',

  // Profile interactions
  PROFILE_VIEW: 'profile_view',
  INTEREST_RECEIVED: 'interest_received',
  INTEREST_ACCEPTED: 'interest_accepted',
  INTEREST_REJECTED: 'interest_rejected',

  // Admin notifications
  PROFILE_APPROVED: 'profile_approved',
  PROFILE_REJECTED: 'profile_rejected',
};

export default NotificationType;
