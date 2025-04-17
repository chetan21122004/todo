import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(
 request: NextRequest,
  context: { params: {  id: string | string[]  } }
) {
  try {
    const { id } = params; // Destructure id from params
    const result = await query('SELECT * FROM todos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // Correctly typed params
) {
  try {
    const { id } = params; // Destructure id from params
    const { title, description, completed } = await request.json();

    const result = await query(
      `UPDATE todos 
       SET title = $1, description = $2, completed = $3, 
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING *`,
      [title, description, completed, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // Correctly typed params
) {
  try {
    const { id } = params; // Destructure id from params
    await query('DELETE FROM todos WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
