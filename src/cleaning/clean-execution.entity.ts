import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('executions')
export class CleanExecution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  commands: number;

  @Column({ type: 'int', nullable: false, name: 'result' })
  uniqueVisits: number;

  @Column({ type: 'float', nullable: false })
  duration: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'timestamp' })
  insertedAt: string;
}
