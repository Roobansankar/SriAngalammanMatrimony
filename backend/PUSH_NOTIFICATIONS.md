# Push Notifications System

This document describes the push notification system implemented for the Sri Angalamman Matrimony App backend.

## Overview

The push notification system uses **Expo Push Notifications** to send notifications to the React Native (Expo) mobile app. Notifications are sent for various events like chat requests, messages, interest responses, and admin actions.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install node-fetch@2
```

### 2. Run Database Migration

Execute the SQL migration to create the `device_tokens` table:

```bash
mysql -u root -p sriang < migrations/create_device_tokens_table.sql
```

Or run the SQL manually:

```sql
CREATE TABLE IF NOT EXISTS device_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  platform ENUM('ios', 'android') NOT NULL,
  device_name VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_active (user_id, is_active),
  INDEX idx_token (token),
  FOREIGN KEY (user_id) REFERENCES register(id) ON DELETE CASCADE
);
```

### 3. Environment Variables

Add the following to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Files Created

```
backend/
├── constants/
│   └── notificationTypes.js    # Notification type constants
├── middleware/
│   └── auth.js                 # JWT authentication middleware
├── migrations/
│   └── create_device_tokens_table.sql  # Database migration
├── routes/
│   └── notifications.js        # Notification API routes
└── services/
    └── notificationService.js  # Core notification service
```

## API Endpoints

### Register Device Token

```http
POST /api/notifications/register-token
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxxxxxxxxxxx]",
  "platform": "android",  // or "ios"
  "deviceName": "Samsung Galaxy S21"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device registered for push notifications"
}
```

### Unregister Device Token

```http
POST /api/notifications/unregister-token
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxxxxxxxxxxx]"
}
```

### Get User's Device Tokens

```http
GET /api/notifications/tokens
Authorization: Bearer <jwt_token>
```

### Delete Device Token

```http
DELETE /api/notifications/tokens/:tokenId
Authorization: Bearer <jwt_token>
```

## Authentication

The notification endpoints require JWT authentication. The token is returned from the login endpoint:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use this token in the `Authorization` header for protected routes:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Notification Types

| Type | Description | Data Fields |
|------|-------------|-------------|
| `phone_request` | Phone number request received | `profileId` |
| `phone_accepted` | Phone request accepted | `profileId` |
| `phone_rejected` | Phone request rejected | - |
| `chat_request` | Chat request received | `profileId` |
| `chat_accepted` | Chat request accepted | `chatId` |
| `chat_rejected` | Chat request rejected | - |
| `new_message` | New chat message | `chatId` |
| `profile_view` | Profile was viewed | `profileId` |
| `interest_received` | Interest received | `profileId` |
| `interest_accepted` | Interest accepted | `profileId` |
| `profile_approved` | Profile approved by admin | - |
| `profile_rejected` | Profile rejected by admin | - |

## Usage in Controllers

### Import the Notification Service

```javascript
import notificationService from "../services/notificationService.js";
```

### Available Methods

#### Token Management
```javascript
// Register a token
await notificationService.registerToken(userId, {
  token: "ExponentPushToken[xxx]",
  platform: "android",
  deviceName: "Device Name"
});

// Unregister a token
await notificationService.unregisterToken(userId, token);

// Unregister all tokens for a user (e.g., on logout)
await notificationService.unregisterAllTokensForUser(userId);
```

#### Phone Request Notifications
```javascript
// When someone requests phone number
await notificationService.notifyPhoneRequest(
  recipientMatriId,   // Who receives the notification
  requesterName,      // Name of the requester
  requesterMatriId    // MatriID of the requester
);

// When phone request is accepted
await notificationService.notifyPhoneAccepted(
  requesterMatriId,   // Original requester
  accepterName,       // Name of person who accepted
  accepterMatriId     // MatriID of accepter
);

// When phone request is rejected
await notificationService.notifyPhoneRejected(
  requesterMatriId,
  rejecterName
);
```

#### Chat Request Notifications
```javascript
// When someone sends a chat request
await notificationService.notifyChatRequest(
  recipientMatriId,
  requesterName,
  requesterMatriId
);

// When chat request is accepted
await notificationService.notifyChatAccepted(
  requesterMatriId,
  accepterName,
  chatId
);

// When chat request is rejected
await notificationService.notifyChatRejected(
  requesterMatriId,
  rejecterName
);
```

#### Message Notifications
```javascript
await notificationService.notifyNewMessage(
  recipientMatriId,
  senderName,
  chatId,
  messagePreview  // First 50 chars of message
);
```

#### Profile Notifications
```javascript
// When someone views a profile
await notificationService.notifyProfileView(
  viewedMatriId,
  viewerName,
  viewerMatriId
);

// When someone sends interest
await notificationService.notifyInterestReceived(
  recipientMatriId,
  senderName,
  senderMatriId
);

// When interest is accepted
await notificationService.notifyInterestAccepted(
  senderMatriId,
  accepterName,
  accepterMatriId
);
```

#### Admin Notifications
```javascript
// When profile is approved
await notificationService.notifyProfileApproved(matriId);

// When profile is rejected
await notificationService.notifyProfileRejected(matriId, reason);
```

#### Generic Notifications
```javascript
// Send to single user by user_id
await notificationService.sendToUser(userId, title, body, data);

// Send to single user by MatriID
await notificationService.sendToMatriId(matriId, title, body, data);

// Send to multiple users
await notificationService.sendToMultipleUsers(userIds, title, body, data);

// Send to multiple MatriIDs
await notificationService.sendToMultipleMatriIds(matriIds, title, body, data);

// Broadcast to all users
await notificationService.broadcastToAllUsers(title, body, data);
```

## Mobile App Integration

The mobile app should:

1. **Request notification permissions** on app start
2. **Get the Expo Push Token** using `Notifications.getExpoPushTokenAsync()`
3. **Send the token to backend** via `POST /api/notifications/register-token`
4. **Handle incoming notifications** and parse the `data` field for deep linking

### Example Mobile Code (React Native / Expo)

```javascript
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const pushToken = tokenData.data;

  // Get JWT token from storage
  const authToken = await AsyncStorage.getItem('authToken');

  // Send to backend
  await fetch('https://your-api.com/api/notifications/register-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      token: pushToken,
      platform: Platform.OS,
      deviceName: Device.modelName,
    }),
  });
}
```

## Error Handling

The notification service automatically:

1. **Handles invalid tokens**: If Expo returns `DeviceNotRegistered`, the token is deactivated
2. **Chunks large batches**: Messages are sent in batches of 100 (Expo's limit)
3. **Logs errors**: All errors are logged to console for debugging

## Testing

You can test push notifications using the Expo Push Notification Tool:
https://expo.dev/notifications

Or use curl:
```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[xxxxxx]",
    "title": "Test Notification",
    "body": "This is a test message",
    "data": { "type": "test" }
  }'
```

## Troubleshooting

### Notifications not being received

1. Check if the token is registered: `GET /api/notifications/tokens`
2. Verify the token is `is_active: true` in the database
3. Check server logs for push errors
4. Ensure the mobile app has notification permissions

### Token keeps getting deactivated

This happens when:
- The app was uninstalled
- The user revoked notification permissions
- The token expired (rare with Expo)

The app should re-register the token on each app launch.

### JWT Authentication errors

- Ensure `JWT_SECRET` is set in environment variables
- Check token expiration (default: 30 days)
- Verify the token is being sent in the `Authorization` header