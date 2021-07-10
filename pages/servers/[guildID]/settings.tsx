import { Switch } from '@headlessui/react';
import GuildView from 'components/guildView';
import Layout from 'components/layout';
import { Formik } from 'formik';
import { resolveGuildMemberPerms } from 'lib/backend-utils';
import { clsx } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import { SHORT_DESCRIPTION_MAX_DATA, SHORT_DESCRIPTION_MIN } from 'lib/serverUpdateValidators';
import withSession from 'lib/session';
import { DESCRIPTION_MAX_DATA, DESCRIPTION_MIN } from 'lib/userUpdateValidators';
import guilds, { GuildData } from 'models/guilds';
import userModule, { userData } from 'models/users';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
// import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { RawGuild, RawGuildMember, withSessionGetServerSideProps } from 'typings/typings';

interface props {
  guild: RawGuild & GuildData & { guild_description: string };
  userProfile: userData;
}

export default function GuildSettings({ guild, userProfile }: props) {
  // const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    function _(evt) {
      const is = document.getElementById('preview_392sf').classList[0].split('pre-')[1];
      const isEscape = evt.key === 'Escape' || evt.key === 'Esc';
      if (is === 'open' && isEscape) setPreviewOpen(false);
    }

    document.addEventListener('keydown', _);

    return () => {
      document.removeEventListener('keydown', _);
    };
  }, []);

  return (
    <Layout title={`${guild.name} - dmod.gg`} description='Server settings'>
      <span id='preview_392sf' className={previewOpen ? 'pre-open' : 'pre-close'} />
      <>
        {/* <div className='ml-2'>
          <button onClick={() => router.push(`/servers/${guild.id}`)} className='bg-indigo-600 rounded p-1'>
            Back to view
          </button>
        </div> */}
        <div className='mx-4 my-2 text-center'>
          <button className='bg-red-600 rounded focus:outline-none px-3 py-2' onClick={() => setPreviewOpen(!previewOpen)}>
            Preview
          </button>
          {/* <div className='absolute'>Test</div> */}
        </div>
        <Formik
          initialValues={{
            description: guild.description,
            short_description: guild.short_description,
            invite: guild.vanity_url_code ?? guild.invite,
            recruiting: guild.recruiting,
            completed: guild.completed,
            view: guild.view,
          }}
          validate={values => {
            const errors: any = {};

            if (values.description.length < DESCRIPTION_MIN || values.description.length > DESCRIPTION_MAX_DATA.NORMAL)
              errors.description = `Description length to long or short. max: ${DESCRIPTION_MAX_DATA.NORMAL} min: ${DESCRIPTION_MIN}`;

            if (values.short_description.length < SHORT_DESCRIPTION_MIN || values.short_description.length > SHORT_DESCRIPTION_MAX_DATA.NORMAL)
              errors.description = `Short description length to long or short. max: ${SHORT_DESCRIPTION_MAX_DATA.NORMAL} min: ${SHORT_DESCRIPTION_MIN}`;

            if (!/[a-zA-Z0-9\\-]{2,32}/.test(values.invite) || (values.invite && values.invite.includes(' '))) errors.invite = 'Invalid invite';

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const body: any = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== guild[key] && value !== undefined));

            const data = await fetch(`${window.origin}/api/v1/servers/${guild.id}/settings`, {
              method: 'PATCH',
              body: JSON.stringify(body),
              headers: {
                authorization: `${userProfile._id}=+${userProfile.updates_access}=+${guild._access_key}`,
              },
            }).then(d => d.json());
            if (data.code || data.message) {
              setSubmitting(false);
              return;
            }

            const updateObjectMapping = Object.fromEntries(Object.entries(data).filter(([key]) => body[key]));

            // eslint-disable-next-line no-param-reassign
            guild = { ...guild, ...data };
            resetForm({ values: { ...values, ...updateObjectMapping } });

            setSubmitting(false);
          }}
        >
          {({ handleSubmit, handleChange, handleBlur, values, isSubmitting, dirty, resetForm, setValues, errors }) => (
            <>
              <div
                className={clsx(
                  'transform transition duration-300 ease-in-out absolute z-40 inset-y-0 inset-x-0 min-h-screen h-full w-full bg-gray-800 bg-opacity-90',
                  previewOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 visible pointer-events-none'
                )}
              >
                <div className='px-10 sm:px-16 pt-5 rounded h-full flex'>
                  <div className='p-2 bg-dorpdown w-full h-full overflow-y-auto'>
                    <GuildView guild={{ ...guild, ...values }} isManager Inpreview />
                  </div>
                  <div className='relative'>
                    <div className='ml-1 focus:outline-none absolute z-0 flex flex-col text-center space-y-1'>
                      <span
                        className='border-2 border-gray-200 h-8 w-8 rounded-full hover:bg-gray-300 hover:bg-opacity-30 cursor-pointer'
                        onClick={() => setPreviewOpen(!previewOpen)}
                      />
                      <span className='cursor-default text-sm'>ESC</span>
                    </div>
                  </div>
                </div>
              </div>

              <span>
                <div
                  className={clsx(
                    'transition duration-500 ease-in-out transform z-0 absolute -bottom-16 left-0 w-full min-w-max sm:w-4/12 p-3 overflow-y-hidden',
                    dirty ? 'translate-y-0 opacity-1' : '-translate-y-6 opacity-0 pointer-events-none'
                  )}
                >
                  <div className='flex bg-popupcard rounded p-2 justify-between space-x-2'>
                    <span className='inline-flex flex-wrap content-center'>Change detected!</span>
                    <div className='flex space-x-2'>
                      <button className='px-2 py-1 bg-blue-800 rounded focus:outline-none' type='button' onClick={() => resetForm()}>
                        Cancel
                      </button>
                      <button className='px-2 py-1 bg-blue-800 rounded focus:outline-none space-x-2' type='submit' disabled={isSubmitting} onClick={() => handleSubmit()}>
                        {isSubmitting && <span title='Saving data...' className='relative inline-flex rounded-full h-3 w-3 bg-red-500' />}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </span>

              <form className='flex justify-center'>
                <div className='mx-4 my-2 space-y-1.5'>
                  {/* Update description content */}
                  <div className='flex flex-col'>
                    <label htmlFor='description'>Description</label>
                    <div className='ml-1'>
                      <textarea
                        className='bg-popupcard text-gray-100 focus:outline-none rounded'
                        id='description'
                        cols={60}
                        rows={15}
                        value={values.description}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        spellCheck='true'
                      />
                    </div>
                    {errors.description && <span>{errors.description}</span>}
                  </div>

                  {/* update short descript content */}

                  <div className='space-x-1'>
                    <label htmlFor='description'>Short description</label>
                    <input
                      className='bg-popupcard text-gray-100 focus:outline-none rounded w-80 px-1 py-0.5'
                      id='short_description'
                      // cols={60}
                      // rows={15}
                      value={values.short_description}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      spellCheck='true'
                    />
                    {errors.short_description && <span>{errors.short_description}</span>}
                  </div>

                  {/* update invit link if server vanity is not precent */}

                  {!guild.vanity_url_code && (
                    <div>
                      <label htmlFor='invite'>Server invite</label>
                      <div className='bg-gray-600 rounded w-1/6 min-w-max px-1 py-px'>
                        https://discord.com/invite/
                        <input
                          className='text-gray-100 bg-gray-600 focus:outline-none px-1 -ml-0.5 bg-opacity-0'
                          type='text'
                          placeholder='1234-abc'
                          value={values.invite ?? ''}
                          id='invite'
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>

                      {errors.invite && <span>{errors.invite}</span>}
                    </div>
                  )}

                  {/* TODO: update recruiting count */}

                  {/* TODO: update tags */}

                  {/* TODO: looking for */}

                  {/* update server visibility */}
                  <div>
                    <label htmlFor='completed'>Mark as visible</label>
                    <div>
                      <Switch
                        checked={values.view}
                        onChange={view => setValues({ ...values, view })}
                        className={`transition duration-300 ease-in-out transform  ${
                          values.view ? 'bg-blue-600' : 'bg-gray-300'
                        } relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none`}
                      >
                        <span className='sr-only'>Active</span>
                        <span
                          className={`transition duration-300 ease-in-out transform  ${
                            values.view ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    </div>
                  </div>

                  {/* One time markdown server complete */}
                  {!guild.completed && (
                    <div>
                      <label htmlFor='completed'>Mark server a completed!</label>
                      <div>
                        <Switch
                          checked={values.completed}
                          onChange={completed => setValues({ ...values, completed, view: !values.completed && !values.view })}
                          className={`transition duration-300 ease-in-out transform  ${
                            values.completed ? 'bg-blue-600' : 'bg-gray-300'
                          } relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none`}
                        >
                          <span className='sr-only'>Active</span>
                          <span
                            className={`transition duration-300 ease-in-out transform  ${
                              values.completed ? 'translate-x-6' : 'translate-x-1'
                            } inline-block w-4 h-4 transform bg-white rounded-full`}
                          />
                        </Switch>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </>
          )}
        </Formik>
      </>
    </Layout>
  );
}

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: withSessionGetServerSideProps): Promise<GetServerSidePropsResult<any>> => {
    await connectToDatabase();
    const session = context.req.session.get('user');
    if (!session) return { notFound: true };

    const guildData = await guilds.findOne({ _id: context.query.guildID as string });
    if (!guildData) return { notFound: true };

    const user = await userModule.findOne({ _id: session.id });
    const objectUser = user.toObject();
    if (!user) return { notFound: true };

    const authHead = { headers: { Authorization: `Bot ${process.env.CLIENT_TOKEN}` } };

    const guild: RawGuild = await fetch(`${API_ENDPOINT}/guilds/${context.query.guildID}?with_counts=true`, authHead).then(json);
    // @ts-expect-error
    if (guild.code || guild.message) return { notFound: true };

    let member: RawGuildMember = null;
    if (session.id) member = await fetch(`${API_ENDPOINT}/guilds/${context.query.guildID}/members/${session.id}`, authHead).then(json);
    // @ts-expect-error
    if (member.code || member.message) return { notFound: true };

    const memberPerms = member ? resolveGuildMemberPerms(guild, member) : 0;

    const isManager = (memberPerms & 0x20) === 0x20;

    if (!isManager) return { notFound: true };

    return {
      props: {
        userProfile: objectUser,
        guild: {
          ...guild,
          guild_description: guild.description,
          ...guildData.toObject(),
        },
      },
    };
  }
);
