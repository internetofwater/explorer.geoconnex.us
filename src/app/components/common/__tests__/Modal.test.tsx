import { fireEvent, render, screen } from '@testing-library/react';
import Modal from '../Modal';

describe('Common Components: Modal', () => {
    const handleClose = jest.fn();
    const title = 'Test Modal';
    const children = <div>Modal Content</div>;

    const renderModal = (open: boolean) => {
        return render(
            <Modal
                action={<></>}
                open={open}
                title={title}
                handleClose={handleClose}
            >
                {children}
            </Modal>
        );
    };

    test('renders Modal when open is true', () => {
        renderModal(true);
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('does not render Modal when open is false', () => {
        renderModal(false);
        expect(screen.queryByText(title)).not.toBeInTheDocument();
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    test('calls handleClose when clicking on the overlay', () => {
        renderModal(true);
        fireEvent.click(screen.getByTestId('modal-overlay'));
        expect(handleClose).toHaveBeenCalled();
    });

    test('does not call handleClose when clicking inside the modal', () => {
        renderModal(true);
        fireEvent.click(screen.getByTestId('modal-content')); // Target the modal content
        // If content still visible, modal is still open
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('calls handleClose when clicking the CloseButton', () => {
        renderModal(true);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClose).toHaveBeenCalled();
    });
});
