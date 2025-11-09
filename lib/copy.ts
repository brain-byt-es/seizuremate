/**
 * A centralized file for all user-facing text.
 * This makes it easy to manage, update, and eventually translate copy.
 */
export const copy = {
  errors: {
    auth: {
      connection: {
        title: 'Connection Issue',
        message: 'We couldn’t connect right now. Please check your connection and try again in a moment.',
      },
    },
    network: {
      generic: {
        title: "Can't Connect",
        message: "Your entry is saved locally. We'll sync it as soon as you're back online.",
      },
    },
    form: {
      invalid: {
        title: 'Just a small correction',
        message: "That doesn't look quite right. Could you please check the highlighted field?",
      },
    },
    system: {
      generic: {
        title: 'Something went wrong',
        message: "Your data is safe. We're looking into the issue now.",
      },
    },
  },
  // We can add other copy strings for onboarding, buttons, etc. here later.
};