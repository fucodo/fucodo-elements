import '../packages/dialog-overlay/dist/index';

export default {
  title: 'Components/DialogOverlay',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
      buttonText: { control: { type: 'text' } }
  },
};

const Template = ({ buttonText = 'close'}) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = `
    <fucodo-modal-once data-auto-open="1" >
        <dialog>
            <form method="dialog">
                <button value="close" class="dialog-close-btn">
                    ${buttonText}
                </button>
            </form>
            Overlay shown once
        </dialog>
    </fucodo-modal-once>
  `;
  const el = wrapper.querySelectorAll('fucodo-modal-once').item(0);
  return el;
};

export const Default = Template.bind({});
Default.args = { size: 32, enabled: true };
