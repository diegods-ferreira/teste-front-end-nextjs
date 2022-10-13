import { GetServerSideProps, GetServerSidePropsContext, PreviewData } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { ParsedUrlQuery } from 'querystring';

import { authOptions } from '../pages/api/auth/[...nextauth]';

export function requireAuthentication(getServerSideProps: GetServerSideProps) {
  return async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { req, res } = context;
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        }
      };
    }

    return await getServerSideProps(context);
  }
}
