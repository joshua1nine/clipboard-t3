import { type NextApiRequest, type NextApiResponse } from 'next';
import { nodeMail } from 'src/utils/nodemailer';

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
   const info = await nodeMail.sendMail({
      from: '"Sender Name" <info@spsclipboard.com>',
      to: 'joshua.kale.michael@gmail.com',
      subject: 'Hello from node',
      text: 'Hello world?',
      html: '<strong>Hello world?</strong>',
      headers: { 'x-myheader': 'test header' },
   });

   console.log('Message sent: %s', info.response);

   res.status(200);
};

export default examples;
