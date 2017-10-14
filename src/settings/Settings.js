import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Select, Radio } from 'antd';
import { getIsReloading, getLocale, getVotingPower, getIsSettingsLoading } from '../reducers';
import { saveSettings } from './settingsActions';
import { reload } from '../auth/authActions';
import Action from '../components/Button/Action';
import Loading from '../components/Icon/Loading';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import './Settings.less';

@connect(
  state => ({
    reloading: getIsReloading(state),
    locale: getLocale(state),
    votingPower: getVotingPower(state),
    loading: getIsSettingsLoading(state),
  }),
  { reload, saveSettings },
)
export default class Settings extends React.Component {
  static propTypes = {
    reloading: PropTypes.bool,
    locale: PropTypes.string,
    votingPower: PropTypes.string,
    loading: PropTypes.bool,
    reload: PropTypes.func,
    saveSettings: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    locale: 'auto',
    votingPower: 'auto',
    loading: false,
    reload: () => {},
    saveSettings: () => {},
  };

  state = {
    locale: 'auto',
    votingPower: 'auto',
  };

  componentWillMount() {
    this.setState({
      locale: this.props.locale,
      votingPower: this.props.votingPower,
    });
  }

  componentDidMount() {
    this.props.reload();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.setState({ locale: nextProps.locale });
    }

    if (nextProps.votingPower !== this.props.votingPower) {
      this.setState({ votingPower: nextProps.votingPower });
    }
  }

  languages = {
    en: 'English',
    id: 'Bahasa Indonesia - Indonesian',
    ms: 'Bahasa Melayu - Malay',
    cs: 'Čeština - Czech',
    da: 'Dansk - Danish',
    de: 'Deutsch - German',
    es: 'Español - Spanish',
    fil: 'Filipino',
    fr: 'Français - French',
    it: 'Italiano - Italian',
    nl: 'Nederlands - Dutch',
    no: 'Norsk - Norwegian',
    pl: 'Polski - Polish',
    pt: 'Português - Portuguese',
    ro: 'Română - Romanian',
    sl: 'Slovenščina - Slovenian',
    sv: 'Svenska - Swedish',
    vi: 'Tiếng Việt - Vietnamese',
    tr: 'Türkçe - Turkish',
    el: 'Ελληνικά - Greek',
    bg: 'Български език - Bulgarian',
    ru: 'Русский - Russian',
    uk: 'Українська мова - Ukrainian',
    he: 'עִבְרִית - Hebrew',
    ar: 'العربية - Arabic‏',
    hi: 'हिन्दी - Hindi',
    lo: 'ພາສາລາວ - Lao',
    th: 'ภาษาไทย - Thai',
    ko: '한국어 - Korean',
    ja: '日本語 - Japanese',
    zh: '简体中文 - Simplified Chinese',
    // zh: '繁體中文 - Traditional Chinese',
  };

  handleSave = () => {
    this.props.saveSettings({
      locale: this.state.locale,
      votingPower: this.state.votingPower,
    });
  };

  handleLocaleChange = locale => this.setState({ locale });
  handleVotingPowerChange = event => this.setState({ votingPower: event.target.value });

  render() {
    const {
      reloading,
      locale: initialLocale,
      votingPower: initialVotingPower,
      loading,
    } = this.props;
    const { votingPower, locale } = this.state;

    const languageOptions = [];

    if (locale === 'auto') {
      languageOptions.push(
        <Select.Option disabled key="auto" value="auto">
          <FormattedMessage id="select_language" defaultMessage="Select your language" />
        </Select.Option>,
      );
    }

    Object.keys(this.languages).forEach((key) => {
      languageOptions.push(
        <Select.Option key={key} value={key}>
          {this.languages[key]}
        </Select.Option>,
      );
    });

    return (
      <div className="shifted">
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <h1>
              <FormattedMessage id="settings" defaultMessage="Settings" />
            </h1>
            {reloading ? (
              <Loading center={false} />
            ) : (
              <div className="Settings">
                <div className="Settings_section">
                  <h3>
                    <FormattedMessage id="voting_power" defaultMessage="Voting Power" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="voting_power_info"
                      defaultMessage="You can enable Voting Power slider to specify exact percentage of your Voting Power to use for upvote."
                    />
                  </p>
                  <Radio.Group
                    defaultValue={initialVotingPower}
                    value={votingPower}
                    onChange={this.handleVotingPowerChange}
                  >
                    <Radio value="off">
                      <FormattedMessage id="voting_power_off" defaultMessage="Disable slider" />
                    </Radio>
                    <Radio value="on">
                      <FormattedMessage id="voting_power_on" defaultMessage="Enable slider" />
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="Settings_section">
                  <h3>
                    <FormattedMessage id="language" defaultMessage="Language" />
                  </h3>
                  <p>
                    <FormattedMessage
                      id="language_info"
                      defaultMessage="What language do you want to use on Busy?"
                    />
                  </p>
                  <Select
                    defaultValue={initialLocale}
                    value={locale}
                    style={{ width: '100%', maxWidth: 240 }}
                    onChange={this.handleLocaleChange}
                  >
                    {languageOptions}
                  </Select>
                </div>
                <Action primary loading={loading} text="Save" onClick={this.handleSave} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
