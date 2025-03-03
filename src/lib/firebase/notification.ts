import admin from './firebaseAdmin'; // Import the initialized Firebase Admin SDK

interface NotificationPayload {
  title: string;
  body: string;
  topic: string;
  link?: string; // Optional deep link (can be used if you want to send a URL)
}

/**
 * Sends a notification to a Firebase topic.
 * 
 * @param {NotificationPayload} notification - The notification details.
 * @returns {Promise<any>} - The response from Firebase Admin SDK after sending the notification.
 * 
 * topics = [panel_task, se_task, new_blog, edit_profile]
 * body format:
 *  task -> topic, fromDept, fromDesignation, toDept, toDesignation, description[0..100], deadline
 *  new_blog -> topic, title, author_name, category
 *  edit_profile -> topic
 * 
 * 
 * 
 */
export async function sendTopicNotification({
    title,
    body,
    topic,
  }: {
    title: string;
    body: string;
    topic: string;
  }) {
    console.log("ENTERED NOTIFICATION")
    try {
      const message = {
        notification: {
          title,
          body,
        },
        topic,
      };
  
      const response = await admin.messaging().send(message);
      console.log("Notification sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
  
  