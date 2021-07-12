import { createMuiTheme } from '@material-ui/core/styles';

// eslint-disable-next-line import/prefer-default-export
export const darkTheme = createMuiTheme({
  body: 'linear-gradient(0deg, #0e0e15, #1a1d29)',
  secondaryText: '#9098AC',
  text: 'white',

  card: {
    background: '#222330',
    boxShadow: '0px 3px 6px #00000029',
    borderRadius: '5px',
    opacity: 1,
  },
  maxButton: {
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #68dbda',
    hoverColor: '#7ae6e5',
    hoverBorder: '1px solid #68dbda',
    color: '#68dbda',
    activeColor: '#000000',
  },
  grid: {
    color: '#68dbda',
    colorHover: '#7ae6e5',
    border: '1px solid #68dbda',
    borderHover: '1px solid #7ae6e5',
  },
  divider: {
    backgroundColor: 'rgb(169,169,169,0.5)',
  },
  dropdown: {
    backgroundColor: '#2d2e3d',
    fadedBackgroundColor: '#222330',
  },
  border: '1px solid #2d2e3d',
  borderAlt: '1px solid #4A4D5F',
  borderBottom: '1px solid rgb(211,211,211, 0.1)',
  backgroundColor: '#0e0e15',
  inputColor: '#2d2e3d',
});
