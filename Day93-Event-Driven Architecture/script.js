document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const publishBtn = document.getElementById("publishBtn");
  const autoPublishBtn = document.getElementById("autoPublishBtn");
  const resetBtn = document.getElementById("resetBtn");
  const eventTypeSelect = document.getElementById("eventType");
  const eventDataInput = document.getElementById("eventData");
  const logContainer = document.getElementById("logContainer");

  // Event broker state
  const eventBroker = {
    topics: {
      "user.created": ["email-service", "analytics-service"],
      "order.placed": [
        "analytics-service",
        "notification-service",
        "shipping-service",
      ],
      "payment.processed": ["notification-service", "analytics-service"],
      "notification.sent": ["email-service"],
    },
    subscribers: {
      "email-service": ["user.created", "notification.sent"],
      "analytics-service": [
        "user.created",
        "order.placed",
        "payment.processed",
      ],
      "notification-service": ["order.placed", "payment.processed"],
      "shipping-service": ["order.placed"],
    },
  };

  // Event log
  let eventLog = [];

  // Initialize the simulator
  function init() {
    // Add event listeners
    publishBtn.addEventListener("click", publishEvent);
    autoPublishBtn.addEventListener("click", autoPublishEvents);
    resetBtn.addEventListener("click", resetSimulator);

    // Populate event data with examples based on event type
    eventTypeSelect.addEventListener("change", updateEventDataExample);
    updateEventDataExample();

    // Log initialization
    addLogEntry("Simulator initialized. Ready to publish events.", "success");
  }

  // Update event data input placeholder based on selected event type
  function updateEventDataExample() {
    const examples = {
      "user.created":
        '{"userId": "123", "name": "John Doe", "email": "john@example.com"}',
      "order.placed": '{"orderId": "ORD-456", "amount": 99.99, "items": 3}',
      "payment.processed":
        '{"paymentId": "PAY-789", "orderId": "ORD-456", "status": "completed"}',
      "notification.sent":
        '{"notificationId": "NOTIF-101", "type": "email", "recipient": "john@example.com"}',
    };

    eventDataInput.placeholder = examples[eventTypeSelect.value];
  }

  // Publish a single event
  function publishEvent() {
    const eventType = eventTypeSelect.value;
    const eventData = eventDataInput.value || "{}";

    if (!eventType) {
      addLogEntry("Please select an event type.", "error");
      return;
    }

    // Choose a publisher based on event type
    let publisherId;
    if (eventType === "user.created") publisherId = "publisher1";
    else if (eventType === "order.placed") publisherId = "publisher2";
    else if (eventType === "payment.processed") publisherId = "publisher3";
    else publisherId = "publisher1"; // Default to first publisher

    // Create event object
    const event = {
      id: generateEventId(),
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      publisher: publisherId,
    };

    // Add to publisher queue
    addEventToPublisher(publisherId, event);

    // Log the event publishing
    addLogEntry(`Event published: ${eventType} (ID: ${event.id})`, "success");

    // Simulate sending to broker after a delay
    setTimeout(() => {
      sendToBroker(publisherId, event);
    }, 1000);
  }

  // Auto-publish multiple events
  function autoPublishEvents() {
    const eventTypes = [
      "user.created",
      "order.placed",
      "payment.processed",
      "notification.sent",
    ];

    const eventDataExamples = [
      '{"userId": "123", "name": "Auto User", "email": "auto@example.com"}',
      '{"orderId": "AUTO-001", "amount": 49.99, "items": 2}',
      '{"paymentId": "AUTO-PAY-002", "orderId": "AUTO-001", "status": "completed"}',
      '{"notificationId": "AUTO-NOTIF-003", "type": "email", "recipient": "auto@example.com"}',
    ];

    let delay = 0;
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * eventTypes.length);
      setTimeout(() => {
        eventTypeSelect.value = eventTypes[randomIndex];
        eventDataInput.value = eventDataExamples[randomIndex];
        publishEvent();
      }, delay);
      delay += 1500;
    }
  }

  // Reset the simulator
  function resetSimulator() {
    // Clear all event queues
    document.querySelectorAll(".event-queue").forEach((queue) => {
      queue.innerHTML = "";
    });

    // Clear event log
    logContainer.innerHTML = "";
    eventLog = [];

    // Reset topics active state
    document.querySelectorAll(".topic").forEach((topic) => {
      topic.classList.remove("active");
    });

    addLogEntry("Simulator reset. All queues and logs cleared.", "success");
  }

  // Add event to publisher queue
  function addEventToPublisher(publisherId, event) {
    const publisher = document.getElementById(publisherId);
    const queue = publisher.querySelector(".event-queue");

    const eventElement = document.createElement("div");
    eventElement.className = "event-item";
    eventElement.textContent = `${event.type} (${event.id})`;
    eventElement.dataset.eventId = event.id;

    queue.appendChild(eventElement);
  }

  // Send event from publisher to broker
  function sendToBroker(publisherId, event) {
    // Remove from publisher queue
    const publisher = document.getElementById(publisherId);
    const eventElement = publisher.querySelector(
      `[data-event-id="${event.id}"]`
    );
    if (eventElement) {
      eventElement.remove();
    }

    // Visualize event moving to broker
    visualizeEventMovement(publisherId, "broker", event);

    // After animation, process in broker
    setTimeout(() => {
      processInBroker(event);
    }, 1000);
  }

  // Process event in broker
  function processInBroker(event) {
    // Highlight the topic in broker
    const topicElement = document.querySelector(`[data-topic="${event.type}"]`);
    if (topicElement) {
      topicElement.classList.add("active");

      // Log broker processing
      addLogEntry(
        `Broker received event: ${event.type} (ID: ${event.id})`,
        "success"
      );

      // After a delay, send to subscribers
      setTimeout(() => {
        sendToSubscribers(event, topicElement);
      }, 1000);
    }
  }

  // Send event from broker to subscribers
  function sendToSubscribers(event, topicElement) {
    // Get subscribers for this event type
    const subscribers = eventBroker.topics[event.type] || [];

    // Remove active class from topic
    topicElement.classList.remove("active");

    // Send to each subscriber
    subscribers.forEach((subscriberName) => {
      const subscriberElement = document.querySelector(
        `.subscriber .component-name`
      );
      // Find the actual subscriber element by text content
      const allSubscribers = document.querySelectorAll(".subscriber");
      let targetSubscriber = null;

      allSubscribers.forEach((sub) => {
        if (
          sub
            .querySelector(".component-name")
            .textContent.toLowerCase()
            .includes(subscriberName.split("-")[0])
        ) {
          targetSubscriber = sub;
        }
      });

      if (targetSubscriber) {
        // Visualize event moving to subscriber
        visualizeEventMovement(
          "broker",
          targetSubscriber.id,
          event,
          subscriberName
        );

        // After animation, add to subscriber queue
        setTimeout(() => {
          addEventToSubscriber(targetSubscriber, event, subscriberName);
        }, 1000);
      }
    });
  }

  // Add event to subscriber queue
  function addEventToSubscriber(subscriberElement, event, subscriberName) {
    const queue = subscriberElement.querySelector(".event-queue");

    const eventElement = document.createElement("div");
    eventElement.className = "event-item";
    eventElement.textContent = `${event.type} (${event.id})`;

    queue.appendChild(eventElement);

    // Log subscriber receiving
    addLogEntry(
      `Subscriber "${subscriberName}" processed event: ${event.type} (ID: ${event.id})`,
      "success"
    );

    // Remove from subscriber queue after a delay
    setTimeout(() => {
      eventElement.remove();
    }, 3000);
  }

  // Visualize event movement between components
  function visualizeEventMovement(fromId, toId, event, subscriberName = "") {
    const fromElement = document.getElementById(fromId);
    const toElement = document.getElementById(toId);

    if (!fromElement || !toElement) return;

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    const eventMoving = document.createElement("div");
    eventMoving.className = "event-moving";
    eventMoving.textContent = `${event.type} (${event.id.substring(0, 6)}...)`;
    eventMoving.style.position = "fixed";
    eventMoving.style.left = `${fromRect.right}px`;
    eventMoving.style.top = `${fromRect.top + fromRect.height / 2}px`;

    document.body.appendChild(eventMoving);

    // Animate movement
    const animation = eventMoving.animate(
      [
        {
          transform: "translate(0, 0)",
          opacity: 1,
        },
        {
          transform: `translate(${toRect.left - fromRect.right}px, ${
            toRect.top - fromRect.top
          }px)`,
          opacity: 0,
        },
      ],
      {
        duration: 1000,
        easing: "ease-in-out",
      }
    );

    animation.onfinish = () => {
      eventMoving.remove();
    };
  }

  // Add entry to event log
  function addLogEntry(message, type = "") {
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry ${type}`;

    const time = new Date().toLocaleTimeString();
    logEntry.innerHTML = `
            <div class="log-time">${time}</div>
            <div>${message}</div>
        `;

    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;

    // Add to event log array
    eventLog.push({
      timestamp: new Date(),
      message: message,
      type: type,
    });
  }

  // Generate a unique event ID
  function generateEventId() {
    return (
      "evt_" +
      Math.random().toString(36).substring(2, 9) +
      "_" +
      Date.now().toString(36)
    );
  }

  // Initialize the simulator
  init();
});

