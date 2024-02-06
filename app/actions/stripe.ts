import 'server-only';

import Stripe from 'stripe';
import { createInvoice } from '@/utils/stripe-invoice';

const stripe = new Stripe(
  process.env.NEXT_PRIVATE_STRIPE_SECRET_KEY as string,
  {
    apiVersion: '2023-10-16',
  }
);

const lookupCustomer = async (
  email: string
): Promise<Stripe.Customer | null> => {
  try {
    const existingCustomer: Stripe.Response<Stripe.ApiList<Stripe.Customer>> =
      await stripe.customers.list({
        email: email,
        limit: 1,
      });
    if (existingCustomer.data.length) {
      return existingCustomer.data[0];
    }

    return null;
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

const createCustomer = async (
  customerParams: Stripe.CustomerCreateParams
): Promise<Stripe.Customer> => {
  try {
    return await stripe.customers.create(customerParams);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createSubscription = async (
  userEmail: string,
  planType: string
): Promise<any> => {
  let currentUser: Stripe.Customer | null = null;
  const planTypes: {
    price: number;
    name: string;
  }[] = [
    {
      name: 'single',
      price: 199,
    },
    {
      name: 'monthly',
      price: 499,
    },
    {
      name: 'yearly',
      price: 699,
    },
  ];

  // first we will check if the user already exists in stripe
  const currentPlanType:
    | {
        price: number;
        name: string;
      }
    | undefined = planTypes.find(
    (plan: { name: string; price: number }): boolean => plan.name === planType
  );

  // try to find the customer via the email
  const isExistingCustomer = await lookupCustomer(userEmail);

  if (isExistingCustomer) currentUser = isExistingCustomer;

  if (!isExistingCustomer) {
    const newCustomerParams: Stripe.CustomerCreateParams = {
      email: userEmail,
    };

    try {
      currentUser = await createCustomer(newCustomerParams);

      if (!currentUser) return null;
    } catch (error) {
      console.error(error);
    }
  }

  if (!currentPlanType || !currentUser) return null;

  const invoice = createInvoice(currentUser, currentPlanType.price, stripe);

  return {
    invoice,
    paymentPrice: currentPlanType.price,
  };
};
